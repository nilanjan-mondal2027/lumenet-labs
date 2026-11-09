from __future__ import annotations

import math
import subprocess
from dataclasses import dataclass
from pathlib import Path
import shutil

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
    Scene("Lumenet Labs Presents", "A premium practical AI experience", (78, 227, 220)),
    Scene("Evolve with AI", "Free 8-day live online workshop", (240, 196, 98)),
    Scene("Stop Using AI Randomly", "Build real workflows for real goals", (95, 225, 214)),
    Scene("Study + Exam Advantage", "Notes, revision, memory, and planning systems", (241, 183, 90)),
    Scene("College + Scholarships", "Research, essays, SOP/LOR support, interview prep", (88, 214, 210)),
    Scene("Career + Projects", "CV, networking, portfolio, practical execution", (233, 178, 89)),
    Scene("Business + Content", "Ideas, validation, offers, and personal brand systems", (90, 225, 210)),
    Scene("AI Brain + Automation", "Personal intelligence stack for daily life", (245, 195, 102)),
    Scene("1 July to 8 July 2026", "7:30 PM to 9:30 PM IST | Live online via Zoom", (98, 226, 219)),
    Scene("Register Free Now", "Scan QR or use the Google Form link", (245, 204, 118)),
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


H1_FONT = load_font(58, serif=True)
H2_FONT = load_font(30, serif=False)
KICKER_FONT = load_font(22, serif=False)
CHIP_FONT = load_font(18, serif=False)

XX = np.linspace(0.0, 1.0, W, dtype=np.float32)
YY = np.linspace(0.0, 1.0, H, dtype=np.float32)
GRID_X, GRID_Y = np.meshgrid(XX, YY)


def clamp01(value: float) -> float:
    return 0.0 if value < 0 else 1.0 if value > 1 else value


def smoothstep(a: float, b: float, x: float) -> float:
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
    phase = t * 0.33

    r = 8 + 16 * GRID_Y + 12 * np.sin((GRID_X * 6.4) + phase)
    g = 10 + 18 * GRID_Y + 10 * np.sin((GRID_X * 4.2) + (GRID_Y * 3.3) + phase * 1.3)
    b = 16 + 36 * GRID_Y + 18 * np.sin((GRID_X * 7.2) + phase * 1.7)

    stack = np.clip(np.stack([r, g, b], axis=-1), 0, 255).astype(np.uint8)
    return Image.fromarray(stack, "RGB")


def add_tile_blur_layer(base: Image.Image, t: float, scene_idx: int) -> Image.Image:
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")

    tile_w, tile_h = 86, 60
    cols = W // tile_w + 2
    rows = H // tile_h + 2

    for row in range(rows):
        for col in range(cols):
            x0 = col * tile_w - 16 + int(6 * math.sin(t * 0.8 + row * 0.7))
            y0 = row * tile_h - 14 + int(8 * math.cos(t * 0.7 + col * 0.55))
            x1 = x0 + tile_w - 10
            y1 = y0 + tile_h - 8

            pulse = 0.5 + 0.5 * math.sin((col * 0.6) + (row * 0.8) + t * 1.9)
            gold = int(75 + 90 * pulse)
            cyan = int(60 + 110 * (1 - pulse))
            alpha = int(26 + 34 * pulse)

            if (col + row + scene_idx) % 3 == 0:
                fill = (gold, int(gold * 0.8), 40, alpha)
                outline = (230, 186, 102, int(alpha * 1.5))
            else:
                fill = (20, cyan, cyan + 20, alpha)
                outline = (86, 224, 216, int(alpha * 1.3))

            draw.rounded_rectangle((x0, y0, x1, y1), radius=12, fill=fill, outline=outline, width=1)

    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=3.4))
    return Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")


def add_glow_and_particles(base: Image.Image, t: float, accent: tuple[int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")

    # Ambient glow orbs.
    orb_specs = [
        (0.18 + 0.04 * math.sin(t * 0.5), 0.22 + 0.03 * math.cos(t * 0.7), 240, (accent[0], accent[1], accent[2], 80)),
        (0.82 + 0.03 * math.cos(t * 0.6), 0.18 + 0.04 * math.sin(t * 0.4), 210, (232, 178, 86, 70)),
        (0.25 + 0.05 * math.cos(t * 0.55), 0.82 + 0.02 * math.sin(t * 0.8), 280, (44, 155, 170, 64)),
    ]
    for ox, oy, radius, color in orb_specs:
        cx, cy = int(ox * W), int(oy * H)
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=color)

    # Particle network.
    for i in range(52):
        px = int((0.08 + (i * 0.0107) + 0.02 * math.sin(t * 0.9 + i)) % 1.0 * W)
        py = int((0.12 + (i * 0.0163) + 0.025 * math.cos(t * 0.7 + i * 0.4)) % 1.0 * H)
        r = 1 + (i % 2)
        a = 110 if i % 3 else 150
        draw.ellipse((px - r, py - r, px + r, py + r), fill=(180, 245, 242, a))
        if i % 7 == 0:
            px2 = px + int(22 * math.cos(i + t))
            py2 = py + int(22 * math.sin(i + t * 1.2))
            draw.line((px, py, px2, py2), fill=(95, 200, 193, 55), width=1)

    # Horizontal light streak.
    streak_y = int(H * (0.34 + 0.02 * math.sin(t * 1.4)))
    draw.rectangle((0, streak_y - 1, W, streak_y + 1), fill=(255, 214, 138, 35))

    layer = layer.filter(ImageFilter.GaussianBlur(radius=1.8))
    return Image.alpha_composite(base.convert("RGBA"), layer).convert("RGB")


def add_floating_cards(base: Image.Image, t: float) -> Image.Image:
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer, "RGBA")

    cards = [
        ("Study", 0.11, 0.2, 168, 56, 0.9),
        ("Applications", 0.72, 0.22, 190, 56, 1.1),
        ("AI Brain", 0.11, 0.68, 160, 54, 1.3),
        ("Career", 0.75, 0.66, 150, 52, 1.6),
        ("Projects", 0.43, 0.1, 145, 50, 1.0),
    ]

    for label, rx, ry, cw, ch, speed in cards:
        x = int(rx * W + 12 * math.sin(t * speed))
        y = int(ry * H + 10 * math.cos(t * speed * 0.85))
        rect = (x, y, x + cw, y + ch)
        draw.rounded_rectangle(rect, radius=14, fill=(12, 18, 30, 138), outline=(108, 206, 200, 96), width=2)
        draw.text((x + 12, y + 16), label, font=CHIP_FONT, fill=(226, 242, 242, 208))

    layer = layer.filter(ImageFilter.GaussianBlur(radius=1.0))
    return Image.alpha_composite(base.convert("RGBA"), layer).convert("RGB")


def draw_blur_panel(frame: Image.Image) -> Image.Image:
    panel_box = (84, 118, W - 84, H - 98)

    blurred = frame.filter(ImageFilter.GaussianBlur(radius=6.8))
    mask = Image.new("L", (W, H), 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.rounded_rectangle(panel_box, radius=38, fill=195)
    frame.paste(blurred, (0, 0), mask)

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay, "RGBA")
    odraw.rounded_rectangle(panel_box, radius=30, fill=(8, 14, 24, 88), outline=(118, 190, 202, 120), width=2)
    odraw.rounded_rectangle((panel_box[0] + 8, panel_box[1] + 8, panel_box[2] - 8, panel_box[3] - 8), radius=24, outline=(232, 190, 106, 80), width=1)
    return Image.alpha_composite(frame.convert("RGBA"), overlay).convert("RGB")


def draw_text_block(draw: ImageDraw.ImageDraw, title: str, subtitle: str, accent: tuple[int, int, int], alpha: float, y_shift: float) -> None:
    if alpha <= 0:
        return

    a = int(255 * alpha)
    glow_a = int(120 * alpha)
    shadow_a = int(110 * alpha)

    kicker = "LUMENET LABS"
    kicker_box = draw.textbbox((0, 0), kicker, font=KICKER_FONT)
    kicker_w = kicker_box[2] - kicker_box[0]
    kicker_x = (W - kicker_w) // 2
    kicker_y = int(156 + y_shift)
    draw.text((kicker_x, kicker_y), kicker, font=KICKER_FONT, fill=(170, 235, 230, int(205 * alpha)))

    title_box = draw.textbbox((0, 0), title, font=H1_FONT)
    title_w = title_box[2] - title_box[0]
    title_x = (W - title_w) // 2
    title_y = int(212 + y_shift)

    # Glow layers.
    for dx, dy in [(-3, 0), (3, 0), (0, -3), (0, 3), (0, 0)]:
        draw.text((title_x + dx, title_y + dy), title, font=H1_FONT, fill=(accent[0], accent[1], accent[2], glow_a))
    draw.text((title_x + 2, title_y + 2), title, font=H1_FONT, fill=(10, 14, 22, shadow_a))
    draw.text((title_x, title_y), title, font=H1_FONT, fill=(245, 236, 225, a))

    sub_box = draw.textbbox((0, 0), subtitle, font=H2_FONT)
    sub_w = sub_box[2] - sub_box[0]
    sub_x = (W - sub_w) // 2
    sub_y = int(304 + y_shift)
    draw.text((sub_x, sub_y), subtitle, font=H2_FONT, fill=(230, 236, 240, int(228 * alpha)))


def draw_bottom_chips(draw: ImageDraw.ImageDraw, t: float) -> None:
    labels = ["8 Days", "16 Hours", "Live via Zoom", "Register Free"]
    chip_w, chip_h = 138, 38
    gap = 14
    total_w = len(labels) * chip_w + (len(labels) - 1) * gap
    x = (W - total_w) // 2
    y = H - 84 + int(3 * math.sin(t * 1.5))

    for i, label in enumerate(labels):
        cx = x + i * (chip_w + gap)
        fill = (12, 18, 28, 168)
        outline = (108, 208, 201, 120) if i % 2 == 0 else (230, 186, 102, 130)
        draw.rounded_rectangle((cx, y, cx + chip_w, y + chip_h), radius=20, fill=fill, outline=outline, width=2)

        b = draw.textbbox((0, 0), label, font=CHIP_FONT)
        tw = b[2] - b[0]
        th = b[3] - b[1]
        tx = cx + (chip_w - tw) // 2
        ty = y + (chip_h - th) // 2 - 1
        draw.text((tx, ty), label, font=CHIP_FONT, fill=(235, 240, 243, 225))


def frame_for_time(t: float) -> np.ndarray:
    scene_idx, local_t = find_scene(t)
    scene = SCENES[scene_idx]

    frame = base_background(t)
    frame = add_tile_blur_layer(frame, t, scene_idx)
    frame = add_glow_and_particles(frame, t, scene.accent)
    frame = add_floating_cards(frame, t)
    frame = draw_blur_panel(frame)

    draw = ImageDraw.Draw(frame, "RGBA")

    # Scene text transition without cross-scene overlap.
    scene_d = scene.duration
    fade_in = smoothstep(0.0, 0.6, local_t)
    fade_out = 1.0 - smoothstep(scene_d - 0.6, scene_d, local_t)
    alpha = fade_in * fade_out
    y_shift = 10.0 * (1.0 - alpha)
    draw_text_block(draw, scene.title, scene.subtitle, scene.accent, alpha, y_shift=y_shift)

    draw_bottom_chips(draw, t)

    return np.asarray(frame, dtype=np.uint8)


def write_captions() -> None:
    srt_path = CAPTIONS_DIR / "intro-teaser-60s-animated.srt"
    vtt_path = CAPTIONS_DIR / "intro-teaser-60s-animated.vtt"

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

        lines_srt.append(str(i))
        lines_srt.append(f"{stamp_srt(start)} --> {stamp_srt(end)}")
        lines_srt.append(text)
        lines_srt.append("")

        lines_vtt.append(f"{stamp_vtt(start)} --> {stamp_vtt(end)}")
        lines_vtt.append(text)
        lines_vtt.append("")

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

    out_silent = VIDEO_DIR / "intro-teaser-60s-animated-silent.mp4"
    out_audio = VIDEO_DIR / "intro-teaser-60s-animated-audio.mp4"
    out_webm = VIDEO_DIR / "intro-teaser-60s-animated-audio.webm"

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
        "24",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(out_silent),
    ]

    proc = subprocess.Popen(cmd_silent, stdin=subprocess.PIPE)
    assert proc.stdin is not None

    for frame_idx in range(FRAMES):
        t = frame_idx / FPS
        frame = frame_for_time(t)
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
            f"[1:a]atrim=0:{DURATION},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1.2,afade=t=out:st={DURATION - 2}:d=2,volume=0.95[aout]",
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
        "-crf",
        "38",
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
