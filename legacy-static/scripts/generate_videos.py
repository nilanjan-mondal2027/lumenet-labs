from __future__ import annotations

import json
import math
import subprocess
from dataclasses import dataclass
from pathlib import Path

import imageio.v2 as imageio
import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_VIDEO = ROOT / "assets" / "video"
OUT_CAPTIONS = OUT_VIDEO / "captions"
OUT_VOICE = OUT_VIDEO / "voiceover"
OUT_SCENES = OUT_VIDEO / "scenes"

WIDTH, HEIGHT, FPS = 1280, 720, 24

GOLD = (225, 186, 96)
GOLD_SOFT = (180, 136, 58)
CYAN = (62, 211, 201)
WHITE = (241, 244, 247)


@dataclass
class Scene:
    text: list[str]
    seconds: float


def get_font(size: int, serif: bool = False) -> ImageFont.FreeTypeFont:
    serif_candidates = [
        "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf",
        "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
    ]
    sans_candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Verdana.ttf",
    ]
    candidates = serif_candidates if serif else sans_candidates
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size)
        except Exception:
            continue
    return ImageFont.load_default()


def frame_background(t: float, duration: float) -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), (5, 6, 8))
    draw = ImageDraw.Draw(img)

    # Soft vertical gradient with gentle motion.
    for y in range(0, HEIGHT, 4):
        tone = int(6 + 16 * (y / HEIGHT) + 5 * math.sin((t * 0.5) + y * 0.01))
        draw.rectangle([(0, y), (WIDTH, min(HEIGHT, y + 4))], fill=(tone, tone + 1, tone + 3))

    # Metallic gold framing lines.
    inset = 24
    draw.rectangle([(inset, inset), (WIDTH - inset, HEIGHT - inset)], outline=(*GOLD, 200), width=2)
    draw.arc([(60, 30), (WIDTH - 60, HEIGHT + 380)], start=200, end=340, fill=GOLD_SOFT, width=2)

    # Cyan network nodes and links.
    center_y = int(HEIGHT * 0.3)
    for i in range(9):
        x = int(WIDTH * 0.15 + i * WIDTH * 0.085)
        wave = int(math.sin(t * 1.3 + i) * 18)
        y = center_y + wave
        r = 4 + (i % 2)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=CYAN)
        if i > 0:
            px = int(WIDTH * 0.15 + (i - 1) * WIDTH * 0.085)
            py = center_y + int(math.sin(t * 1.3 + i - 1) * 18)
            draw.line((px, py, x, y), fill=(36, 110, 122), width=1)

    # Soft center glow.
    glow_alpha = int(42 + 28 * (0.5 + 0.5 * math.sin(t * 1.7)))
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(260, 40, -22):
        a = int(glow_alpha * (r / 260) * 0.12)
        gdraw.ellipse(
            (
                WIDTH // 2 - r,
                int(HEIGHT * 0.44) - r,
                WIDTH // 2 + r,
                int(HEIGHT * 0.44) + r,
            ),
            fill=(212, 168, 79, a),
        )
    return Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")


def draw_centered_text(draw: ImageDraw.ImageDraw, lines: list[str], local_t: float, scene_seconds: float) -> None:
    fade_in = min(1.0, local_t / 0.9)
    fade_out = min(1.0, max(0.0, scene_seconds - local_t) / 0.7)
    alpha = fade_in * fade_out

    heading_font = get_font(72, serif=True)
    sub_font = get_font(40, serif=False)

    total_h = 0
    sizes = []
    for idx, line in enumerate(lines):
        font = heading_font if idx == 0 else sub_font
        bbox = draw.textbbox((0, 0), line, font=font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        sizes.append((line, font, w, h))
        total_h += h + 16
    total_h -= 16

    y = int(HEIGHT * 0.46 - total_h / 2)
    for idx, (line, font, w, h) in enumerate(sizes):
        x = (WIDTH - w) // 2
        color = GOLD if idx == 0 else WHITE
        color = tuple(int(c * alpha) for c in color)
        shadow = tuple(int(c * alpha * 0.5) for c in (8, 10, 16))
        draw.text((x + 2, y + 2), line, font=font, fill=shadow)
        draw.text((x, y), line, font=font, fill=color)
        y += h + 16


def render_video(name: str, scenes: list[Scene], fps: int = FPS) -> Path:
    duration = sum(scene.seconds for scene in scenes)
    total_frames = int(duration * fps)
    out_mp4 = OUT_VIDEO / f"{name}.mp4"

    writer = imageio.get_writer(out_mp4, fps=fps, codec="libx264", quality=7)

    timeline = []
    t_cursor = 0.0
    for scene in scenes:
        timeline.append((t_cursor, t_cursor + scene.seconds, scene))
        t_cursor += scene.seconds

    for i in range(total_frames):
        t = i / fps
        img = frame_background(t, duration)
        draw = ImageDraw.Draw(img)

        active = timeline[-1]
        for item in timeline:
            if item[0] <= t < item[1]:
                active = item
                break

        start, end, scene = active
        local_t = t - start
        draw_centered_text(draw, scene.text, local_t, scene.seconds)

        # Bottom shimmer bar.
        shimmer_x = int((WIDTH + 160) * ((t % 4.0) / 4.0)) - 160
        draw.line((0, HEIGHT - 84, WIDTH, HEIGHT - 84), fill=(80, 62, 32), width=1)
        draw.rectangle((shimmer_x, HEIGHT - 88, shimmer_x + 160, HEIGHT - 80), fill=(180, 140, 70))

        writer.append_data(np.array(img))

    writer.close()
    return out_mp4


def write_srt(name: str, scenes: list[Scene]) -> Path:
    def to_srt_time(seconds: float) -> str:
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        ms = int((seconds - int(seconds)) * 1000)
        return f"{h:02}:{m:02}:{s:02},{ms:03}"

    out = OUT_CAPTIONS / f"{name}.srt"
    lines = []
    t = 0.0
    for idx, scene in enumerate(scenes, start=1):
        start = t
        end = t + scene.seconds
        t = end
        lines.append(str(idx))
        lines.append(f"{to_srt_time(start)} --> {to_srt_time(end)}")
        lines.append(" ".join(scene.text))
        lines.append("")
    out.write_text("\n".join(lines), encoding="utf-8")
    return out


def write_voiceover(name: str, paragraphs: list[str]) -> Path:
    out = OUT_VOICE / f"{name}-voiceover.txt"
    out.write_text("\n\n".join(paragraphs), encoding="utf-8")
    return out


def write_scene_definition(name: str, scenes: list[Scene]) -> Path:
    out = OUT_SCENES / f"{name}-scenes.json"
    payload = []
    t = 0.0
    for scene in scenes:
        payload.append(
            {
                "start_seconds": round(t, 2),
                "duration_seconds": scene.seconds,
                "text_lines": scene.text,
                "style": "black-gold-cyan cinematic minimal",
            }
        )
        t += scene.seconds
    out.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return out


def convert_webm(mp4_path: Path) -> Path:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    out = mp4_path.with_suffix(".webm")
    cmd = [
        ffmpeg,
        "-y",
        "-i",
        str(mp4_path),
        "-c:v",
        "libvpx-vp9",
        "-b:v",
        "0",
        "-crf",
        "34",
        "-row-mt",
        "1",
        "-an",
        str(out),
    ]
    subprocess.run(cmd, check=True)
    return out


def main() -> None:
    OUT_VIDEO.mkdir(parents=True, exist_ok=True)
    OUT_CAPTIONS.mkdir(parents=True, exist_ok=True)
    OUT_VOICE.mkdir(parents=True, exist_ok=True)
    OUT_SCENES.mkdir(parents=True, exist_ok=True)

    hero_scenes = [
        Scene(["Lumenet Labs Presents"], 3.0),
        Scene(["Evolve with AI"], 4.0),
        Scene(["Free 8-Day Live AI Workshop"], 4.0),
        Scene(["1 July to 8 July 2026"], 4.0),
        Scene(["7:30 PM to 9:30 PM IST"], 4.0),
        Scene(["Register Free"], 5.0),
    ]

    explainer_scenes = [
        Scene(["Evolve with AI", "Practical learning for real life"], 6.0),
        Scene(["Study", "Smarter planning and revision workflows"], 6.0),
        Scene(["Applications", "College, scholarships, essays, interview prep"], 6.0),
        Scene(["AI Brain", "Personal systems for tasks and notes"], 6.0),
        Scene(["Business", "Idea research and validation"], 5.0),
        Scene(["Career", "CV, networking, interview readiness"], 5.0),
        Scene(["Content", "Clear personal branding workflows"], 5.0),
        Scene(["Projects", "Build and showcase practical output"], 5.0),
        Scene(["Free live online workshop", "1 July to 8 July | 7:30 PM to 9:30 PM IST | Register free"], 6.0),
    ]

    recap_scenes = [
        Scene(["Post-Launch Recap Template"], 4.0),
        Scene(["8 Days", "16 Hours"], 4.0),
        Scene(["AI for Study"], 4.0),
        Scene(["AI for Applications"], 4.0),
        Scene(["AI Brain"], 4.0),
        Scene(["Business"], 4.0),
        Scene(["Career"], 4.0),
        Scene(["Projects"], 4.0),
        Scene(["Insert testimonial clip here", "Editable placeholder"], 4.0),
        Scene(["Built by Lumenet Labs"], 4.0),
    ]

    definitions = {
        "hero-promo-silent": hero_scenes,
        "overview-explainer-silent": explainer_scenes,
        "recap-template-silent": recap_scenes,
    }

    voiceover = {
        "hero-promo-silent": [
            "Lumenet Labs presents Evolve with AI.",
            "Join our free 8-day live online workshop from 1 July to 8 July 2026.",
            "Every evening from 7:30 PM to 9:30 PM IST, learn practical AI for real life.",
            "Register free now.",
        ],
        "overview-explainer-silent": [
            "Evolve with AI is a calm, practical, student-friendly workshop designed for real outcomes.",
            "You will learn how to use AI for studying, research, college applications, career preparation, content systems, business ideas, and practical projects.",
            "Across 8 days and 16 live hours, you will build reusable workflows with guided resources.",
            "Free live online workshop, 1 July to 8 July 2026, 7:30 PM to 9:30 PM IST. Register free.",
        ],
        "recap-template-silent": [
            "Use this recap template to summarize workshop outcomes after completion.",
            "Replace placeholder scenes with real screenshots, project highlights, and approved participant quotes.",
            "Close with built by Lumenet Labs.",
        ],
    }

    shot_list_lines = ["# Video Shot Lists", ""]

    for name, scenes in definitions.items():
        mp4 = render_video(name, scenes)
        webm = convert_webm(mp4)
        srt = write_srt(name.replace("-silent", ""), scenes)
        voice = write_voiceover(name, voiceover[name])
        scene_def = write_scene_definition(name, scenes)

        shot_list_lines.append(f"## {name}")
        t = 0.0
        for idx, scene in enumerate(scenes, start=1):
            shot_list_lines.append(f"- Scene {idx}: {t:.1f}s to {t + scene.seconds:.1f}s | {' / '.join(scene.text)}")
            t += scene.seconds
        shot_list_lines.append(f"- MP4: {mp4.name}")
        shot_list_lines.append(f"- WEBM: {webm.name}")
        shot_list_lines.append(f"- Captions: {srt.name}")
        shot_list_lines.append(f"- Voiceover Script: {voice.name}")
        shot_list_lines.append(f"- Scene Definition: {scene_def.name}")
        shot_list_lines.append("")

    (OUT_SCENES / "shot-lists.md").write_text("\n".join(shot_list_lines), encoding="utf-8")
    print("Video generation complete.")


if __name__ == "__main__":
    main()
