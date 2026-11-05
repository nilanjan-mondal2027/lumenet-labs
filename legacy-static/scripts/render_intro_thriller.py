from __future__ import annotations

import math
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
VIDEO_DIR = ROOT / "assets" / "video"
CAPTIONS_DIR = VIDEO_DIR / "captions"
SOURCE_AUDIO = VIDEO_DIR / "source" / "teaser-source.mp4"

W, H, FPS = 960, 540, 20
DURATION = 60.0
FRAMES = int(DURATION * FPS)


@dataclass
class Scene:
    title: str
    subtitle: str
    accent: tuple[int, int, int]
    duration: float = 6.0


SCENES = [
    Scene("Lumenet Labs Presents", "A practical AI transformation experience", (88, 230, 220)),
    Scene("Evolve with AI", "Free 8-day live online workshop", (246, 202, 110)),
    Scene("Stop Random AI Use", "Build systems that drive real outcomes", (92, 225, 214)),
    Scene("Study + Exam Precision", "Revision loops, notes, memory prompts, planning", (241, 186, 94)),
    Scene("College + Scholarships", "Research, essays, SOP/LOR support, interviews", (90, 216, 209)),
    Scene("Career + Projects", "CV upgrades, networking, portfolio execution", (236, 182, 92)),
    Scene("Business + Content", "Offer ideas, validation, and smart content flow", (90, 224, 210)),
    Scene("AI Brain + Automation", "Build a personal intelligence operating layer", (243, 196, 106)),
    Scene("1 July to 8 July 2026", "7:30 PM to 9:30 PM IST | Live online via Zoom", (95, 226, 220)),
    Scene("Register Free Now", "Scan the QR and lock your seat", (245, 205, 118)),
]


def load_font(size: int, serif: bool = False) -> ImageFont.FreeTypeFont:
    serif_candidates = [
        "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf",
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
    ]
    sans_candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Verdana Bold.ttf",
    ]
    for path in (serif_candidates if serif else sans_candidates):
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            pass
    return ImageFont.load_default()


H1_FONT = load_font(56, serif=True)
H2_FONT = load_font(28, serif=False)
KICKER_FONT = load_font(22, serif=False)
CHIP_FONT = load_font(17, serif=False)

XX = np.linspace(0.0, 1.0, W, dtype=np.float32)
YY = np.linspace(0.0, 1.0, H, dtype=np.float32)
GRID_X, GRID_Y = np.meshgrid(XX, YY)


def clamp01(value: float) -> float:
    return 0.0 if value < 0 else 1.0 if value > 1 else value


def smoothstep(a: float, b: float, x: float) -> float:
    if b == a:
        return 1.0
    t = clamp01((x - a) / (b - a))
    return t * t * (3.0 - 2.0 * t)


def find_scene(t: float) -> tuple[int, float]:
    cursor = 0.0
    for i, scene in enumerate(SCENES):
        if cursor <= t < cursor + scene.duration:
            return i, t - cursor
        cursor += scene.duration
    return len(SCENES) - 1, SCENES[-1].duration


def base_background(t: float) -> Image.Image:
    phase = t * 0.45
    r = 6 + 12 * GRID_Y + 14 * np.sin((GRID_X * 7.3) + phase)
    g = 8 + 14 * GRID_Y + 10 * np.sin((GRID_X * 5.0) + (GRID_Y * 4.4) + phase * 1.25)
    b = 13 + 30 * GRID_Y + 18 * np.sin((GRID_X * 8.1) + phase * 1.7)

    stack = np.clip(np.stack([r, g, b], axis=-1), 0, 255).astype(np.uint8)
    image = Image.fromarray(stack, "RGB")

    # Vignette for stronger thriller mood.
    vignette = Image.new("L", (W, H), 0)
    vdraw = ImageDraw.Draw(vignette)
    vdraw.ellipse((-W * 0.2, -H * 0.2, W * 1.2, H * 1.2), fill=220)
    vignette = vignette.filter(ImageFilter.GaussianBlur(radius=80))

    dark = Image.new("RGB", (W, H), (4, 5, 8))
    image = Image.composite(image, dark, vignette)
    return image


def add_network_grid(base: Image.Image, t: float) -> Image.Image:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")

    # Circuit-like side traces.
    for side in [0, 1]:
        x_base = 40 if side == 0 else W - 40
        sign = 1 if side == 0 else -1
        for i in range(14):
            y = 42 + i * 34 + int(6 * math.sin(t * 0.9 + i))
            x2 = x_base + sign * (28 + (i % 4) * 14)
            x3 = x2 + sign * (28 + (i % 3) * 8)
            draw.line((x_base, y, x2, y, x2, y + 11, x3, y + 11), fill=(233, 191, 105, 70), width=1)
            draw.ellipse((x3 - 2, y + 9, x3 + 2, y + 13), fill=(108, 220, 214, 120))

    # Moving tile bands.
    for r in range(8):
        y = 60 + r * 58 + int(4 * math.sin(t * 0.7 + r))
        for c in range(11):
            x = 120 + c * 72 + int(8 * math.cos(t * 0.8 + c * 0.6 + r))
            pulse = 0.5 + 0.5 * math.sin(t * 1.6 + c * 0.5 + r * 0.7)
            a = int(14 + 24 * pulse)
            color = (32, int(122 + 84 * pulse), int(132 + 90 * pulse), a)
            draw.rounded_rectangle((x, y, x + 52, y + 34), radius=8, fill=color, outline=(102, 214, 208, a + 16), width=1)

    layer = layer.filter(ImageFilter.GaussianBlur(radius=2.3))
    return Image.alpha_composite(base.convert("RGBA"), layer).convert("RGB")


def add_thriller_streaks(base: Image.Image, t: float, accent: tuple[int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")

    # Diagonal light shards.
    for i in range(14):
        k = t * 0.55 + i * 0.47
        x = int(((i * 71) + 160 * math.sin(k)) % (W + 260)) - 130
        y = int(((i * 49) + 130 * math.cos(k * 1.2)) % (H + 180)) - 90
        length = 100 + (i % 4) * 34
        draw.line((x, y, x + length, y - int(length * 0.38)), fill=(accent[0], accent[1], accent[2], 58), width=2)

    # Center flare sweep.
    sweep_y = int(H * (0.42 + 0.03 * math.sin(t * 1.25)))
    draw.rectangle((0, sweep_y - 2, W, sweep_y + 2), fill=(248, 208, 122, 42))
    draw.rectangle((0, sweep_y + 22, W, sweep_y + 23), fill=(92, 220, 214, 28))

    # Particles.
    for i in range(68):
        px = int((0.06 + (i * 0.013) + 0.025 * math.sin(t * 0.95 + i)) % 1.0 * W)
        py = int((0.08 + (i * 0.017) + 0.02 * math.cos(t * 0.82 + i * 0.5)) % 1.0 * H)
        rad = 1 + (i % 2)
        alpha = 92 + (i % 4) * 18
        draw.ellipse((px - rad, py - rad, px + rad, py + rad), fill=(178, 243, 240, alpha))

    layer = layer.filter(ImageFilter.GaussianBlur(radius=1.6))
    return Image.alpha_composite(base.convert("RGBA"), layer).convert("RGB")


def add_floating_cards(base: Image.Image, t: float) -> Image.Image:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")

    cards = [
        ("Study", 0.10, 0.18, 160, 52, 0.95),
        ("Applications", 0.72, 0.20, 184, 54, 1.12),
        ("AI Brain", 0.10, 0.69, 150, 50, 1.33),
        ("Career", 0.76, 0.67, 142, 50, 1.55),
        ("Projects", 0.42, 0.10, 142, 50, 1.08),
    ]

    for label, rx, ry, cw, ch, speed in cards:
        x = int(rx * W + 11 * math.sin(t * speed))
        y = int(ry * H + 9 * math.cos(t * speed * 0.88))
        draw.rounded_rectangle((x, y, x + cw, y + ch), radius=13, fill=(12, 18, 30, 146), outline=(104, 208, 202, 108), width=2)
        draw.text((x + 12, y + 14), label, font=CHIP_FONT, fill=(230, 244, 244, 212))

    layer = layer.filter(ImageFilter.GaussianBlur(radius=0.95))
    return Image.alpha_composite(base.convert("RGBA"), layer).convert("RGB")


def draw_text_panel(frame: Image.Image) -> Image.Image:
    panel_box = (86, 116, W - 86, H - 98)

    blurred = frame.filter(ImageFilter.GaussianBlur(radius=7.0))
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).rounded_rectangle(panel_box, radius=32, fill=200)
    frame.paste(blurred, (0, 0), mask)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    draw.rounded_rectangle(panel_box, radius=32, fill=(8, 14, 24, 92), outline=(108, 198, 208, 115), width=2)
    draw.rounded_rectangle((panel_box[0] + 8, panel_box[1] + 8, panel_box[2] - 8, panel_box[3] - 8), radius=24, outline=(236, 194, 107, 86), width=1)

    return Image.alpha_composite(frame.convert("RGBA"), overlay).convert("RGB")


def draw_scene_text(draw: ImageDraw.ImageDraw, scene: Scene, alpha: float, y_shift: float) -> None:
    if alpha <= 0:
        return

    a = int(255 * alpha)
    glow_a = int(130 * alpha)
    shadow_a = int(112 * alpha)

    kicker = "LUMENET LABS"
    kw = draw.textbbox((0, 0), kicker, font=KICKER_FONT)[2]
    kx = (W - kw) // 2
    ky = int(156 + y_shift)
    draw.text((kx, ky), kicker, font=KICKER_FONT, fill=(178, 238, 234, int(208 * alpha)))

    title = scene.title
    tw = draw.textbbox((0, 0), title, font=H1_FONT)[2]
    tx = (W - tw) // 2
    ty = int(212 + y_shift)
    for dx, dy in [(-3, 0), (3, 0), (0, -3), (0, 3), (0, 0)]:
        draw.text((tx + dx, ty + dy), title, font=H1_FONT, fill=(scene.accent[0], scene.accent[1], scene.accent[2], glow_a))
    draw.text((tx + 2, ty + 2), title, font=H1_FONT, fill=(9, 12, 18, shadow_a))
    draw.text((tx, ty), title, font=H1_FONT, fill=(246, 237, 225, a))

    subtitle = scene.subtitle
    sw = draw.textbbox((0, 0), subtitle, font=H2_FONT)[2]
    sx = (W - sw) // 2
    sy = int(306 + y_shift)
    draw.text((sx, sy), subtitle, font=H2_FONT, fill=(230, 237, 241, int(226 * alpha)))


def draw_bottom_chips(draw: ImageDraw.ImageDraw, t: float) -> None:
    labels = ["8 Days", "16 Hours", "Live via Zoom", "Register Free"]
    chip_w, chip_h = 138, 38
    gap = 14
    total = len(labels) * chip_w + (len(labels) - 1) * gap
    x = (W - total) // 2
    y = H - 84 + int(3 * math.sin(t * 1.5))

    for i, label in enumerate(labels):
        cx = x + i * (chip_w + gap)
        outline = (108, 210, 203, 120) if i % 2 == 0 else (234, 188, 103, 130)
        draw.rounded_rectangle((cx, y, cx + chip_w, y + chip_h), radius=20, fill=(12, 18, 28, 170), outline=outline, width=2)
        bb = draw.textbbox((0, 0), label, font=CHIP_FONT)
        tw = bb[2] - bb[0]
        th = bb[3] - bb[1]
        draw.text((cx + (chip_w - tw) // 2, y + (chip_h - th) // 2 - 1), label, font=CHIP_FONT, fill=(236, 241, 244, 225))


def flash_overlay(frame: Image.Image, local_t: float, scene_d: float, accent: tuple[int, int, int]) -> Image.Image:
    pulse_in = smoothstep(0.0, 0.12, local_t) * (1.0 - smoothstep(0.12, 0.24, local_t))
    pulse_out = smoothstep(scene_d - 0.24, scene_d - 0.12, local_t) * (1.0 - smoothstep(scene_d - 0.12, scene_d, local_t))
    pulse = max(pulse_in, pulse_out)
    if pulse <= 0.001:
        return frame

    overlay = Image.new("RGBA", (W, H), (accent[0], accent[1], accent[2], int(38 * pulse)))
    return Image.alpha_composite(frame.convert("RGBA"), overlay).convert("RGB")


def frame_for_time(t: float) -> np.ndarray:
    scene_idx, local_t = find_scene(t)
    scene = SCENES[scene_idx]
    scene_d = scene.duration

    frame = base_background(t)
    frame = add_network_grid(frame, t)
    frame = add_thriller_streaks(frame, t, scene.accent)
    frame = add_floating_cards(frame, t)
    frame = draw_text_panel(frame)

    draw = ImageDraw.Draw(frame, "RGBA")

    fade_in = smoothstep(0.0, 0.7, local_t)
    hold = 1.0 - smoothstep(scene_d - 1.0, scene_d - 0.7, local_t)
    fade_out = 1.0 - smoothstep(scene_d - 0.7, scene_d, local_t)
    alpha = fade_in * max(hold, 0.35) * fade_out
    y_shift = 12.0 * (1.0 - alpha)

    draw_scene_text(draw, scene, alpha, y_shift)
    draw_bottom_chips(draw, t)

    frame = flash_overlay(frame, local_t, scene_d, scene.accent)

    return np.asarray(frame, dtype=np.uint8)


def write_captions() -> None:
    srt_path = CAPTIONS_DIR / "intro-teaser-60s-thriller.srt"
    vtt_path = CAPTIONS_DIR / "intro-teaser-60s-thriller.vtt"

    def stamp_srt(seconds: float) -> str:
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        ms = int((seconds - int(seconds)) * 1000)
        return f"{h:02}:{m:02}:{s:02},{ms:03}"

    def stamp_vtt(seconds: float) -> str:
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        ms = int((seconds - int(seconds)) * 1000)
        return f"{h:02}:{m:02}:{s:02}.{ms:03}"

    lines_srt: list[str] = []
    lines_vtt: list[str] = ["WEBVTT", ""]
    cursor = 0.0
    for i, scene in enumerate(SCENES, 1):
        start = cursor
        end = cursor + scene.duration
        cursor = end
        text = f"{scene.title} — {scene.subtitle}"

        lines_srt.extend([str(i), f"{stamp_srt(start)} --> {stamp_srt(end)}", text, ""])
        lines_vtt.extend([f"{stamp_vtt(start)} --> {stamp_vtt(end)}", text, ""])

    CAPTIONS_DIR.mkdir(parents=True, exist_ok=True)
    srt_path.write_text("\n".join(lines_srt), encoding="utf-8")
    vtt_path.write_text("\n".join(lines_vtt), encoding="utf-8")


def render() -> None:
    try:
        import imageio_ffmpeg
    except ImportError as exc:
        raise SystemExit("Please install imageio-ffmpeg in your environment.") from exc

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    CAPTIONS_DIR.mkdir(parents=True, exist_ok=True)

    out_silent = VIDEO_DIR / "intro-teaser-60s-thriller-silent.mp4"
    out_audio = VIDEO_DIR / "intro-teaser-60s-thriller-audio.mp4"
    out_webm = VIDEO_DIR / "intro-teaser-60s-thriller-audio.webm"

    cmd_silent = [
        ffmpeg,
        "-y",
        "-f",
        "rawvideo",
        "-vcodec",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{W}x{H}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "22",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(out_silent),
    ]

    proc = subprocess.Popen(cmd_silent, stdin=subprocess.PIPE)
    assert proc.stdin is not None

    for idx in range(FRAMES):
        frame = frame_for_time(idx / FPS)
        proc.stdin.write(frame.tobytes())

    proc.stdin.close()
    code = proc.wait()
    if code != 0:
        raise RuntimeError(f"Silent video render failed with exit code {code}")

    if SOURCE_AUDIO.exists():
        cmd_audio = [
            ffmpeg,
            "-y",
            "-i",
            str(out_silent),
            "-stream_loop",
            "-1",
            "-i",
            str(SOURCE_AUDIO),
            "-filter_complex",
            f"[1:a]atrim=0:{DURATION},asetpts=PTS-STARTPTS,"
            "acompressor=threshold=-17dB:ratio=2.2:attack=12:release=140,"
            "bass=g=4:f=120:w=0.7,"
            "treble=g=2.5:f=5000:w=0.6,"
            "afade=t=in:st=0:d=1.0,afade=t=out:st=58:d=2.0,volume=1.06[aout]",
            "-map",
            "0:v:0",
            "-map",
            "[aout]",
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-b:a",
            "160k",
            "-shortest",
            "-movflags",
            "+faststart",
            str(out_audio),
        ]
        subprocess.run(cmd_audio, check=True)
    else:
        shutil.copyfile(out_silent, out_audio)

    cmd_webm = [
        ffmpeg,
        "-y",
        "-i",
        str(out_audio),
        "-c:v",
        "libvpx-vp9",
        "-row-mt",
        "1",
        "-crf",
        "37",
        "-b:v",
        "0",
        "-c:a",
        "libopus",
        "-b:a",
        "96k",
        str(out_webm),
    ]
    subprocess.run(cmd_webm, check=True)

    write_captions()
    print("Rendered:")
    print(out_silent)
    print(out_audio)
    print(out_webm)


if __name__ == "__main__":
    render()

