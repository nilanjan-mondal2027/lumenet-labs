from __future__ import annotations

import subprocess
from pathlib import Path

import imageio.v2 as imageio
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
VIDEO_DIR = ROOT / "assets" / "video"

FILES = [
    ("hero-promo-silent.mp4", "hero-promo-audio.mp4"),
    ("overview-explainer-silent.mp4", "overview-explainer-audio.mp4"),
    ("recap-template-silent.mp4", "recap-template-audio.mp4"),
]


def get_duration_seconds(path: Path) -> float:
    reader = imageio.get_reader(str(path))
    meta = reader.get_meta_data()
    reader.close()
    duration = float(meta.get("duration") or 0)
    if duration <= 0:
      raise RuntimeError(f"Could not read duration for {path}")
    return duration


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def main() -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    for src_name, out_name in FILES:
        src = VIDEO_DIR / src_name
        out = VIDEO_DIR / out_name
        if not src.exists():
            print(f"skip missing {src.name}")
            continue

        dur = round(get_duration_seconds(src), 2)

        # Calm ambient bed using two soft sine layers.
        filter_complex = (
            "[1:a]volume=0.018[a1];"
            "[2:a]volume=0.010[a2];"
            "[a1][a2]amix=inputs=2:normalize=0,"
            f"afade=t=in:st=0:d=1.5,afade=t=out:st={max(dur - 1.8, 0):.2f}:d=1.8[aout]"
        )

        cmd = [
            ffmpeg,
            "-y",
            "-i",
            str(src),
            "-f",
            "lavfi",
            "-i",
            f"sine=frequency=196:sample_rate=48000:duration={dur}",
            "-f",
            "lavfi",
            "-i",
            f"sine=frequency=392:sample_rate=48000:duration={dur}",
            "-filter_complex",
            filter_complex,
            "-map",
            "0:v:0",
            "-map",
            "[aout]",
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-b:a",
            "96k",
            "-shortest",
            str(out),
        ]
        run(cmd)
        print(f"created {out.name}")

        # WebM with Opus audio
        out_webm = out.with_suffix(".webm")
        cmd_webm = [
            ffmpeg,
            "-y",
            "-i",
            str(out),
            "-c:v",
            "libvpx-vp9",
            "-crf",
            "34",
            "-b:v",
            "0",
            "-c:a",
            "libopus",
            "-b:a",
            "64k",
            str(out_webm),
        ]
        run(cmd_webm)
        print(f"created {out_webm.name}")


if __name__ == "__main__":
    main()
