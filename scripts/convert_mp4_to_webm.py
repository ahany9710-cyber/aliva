#!/usr/bin/env python3
"""
Convert all .mp4 files under an assets directory to .webm (VP9 + Opus).

Requires FFmpeg with libvpx-vp9 and libopus (standard Windows/macOS/Linux builds).

Usage:
  python scripts/convert_mp4_to_webm.py
  python scripts/convert_mp4_to_webm.py --assets ./public --recursive
  python scripts/convert_mp4_to_webm.py --assets ./assets --crf 28 --overwrite
  python scripts/convert_mp4_to_webm.py --dry-run

Env: FFMPEG_PATH=/path/to/ffmpeg.exe if ffmpeg is not on PATH (Windows winget install is auto-detected under LocalAppData).
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path


def find_ffmpeg() -> str:
    env = os.environ.get("FFMPEG_PATH", "").strip()
    if env and Path(env).is_file():
        return env
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    # Windows winget: Gyan.FFmpeg installs under LocalAppData\Microsoft\WinGet\Packages
    local = Path(os.environ.get("LOCALAPPDATA", "")) / "Microsoft" / "WinGet" / "Packages"
    if local.is_dir():
        for p in sorted(local.rglob("ffmpeg.exe")):
            return str(p)
    sys.stderr.write(
        "Error: ffmpeg not found. Add to PATH, set FFMPEG_PATH, or install e.g. winget install Gyan.FFmpeg\n"
    )
    sys.exit(1)


def convert_file(
    ffmpeg: str,
    src: Path,
    dst: Path,
    *,
    crf: int,
    audio_bitrate: str,
    deadline: str,
    cpu_used: int,
) -> None:
    """VP9 CRF mode (CRF lower = higher quality; typical 24–32)."""
    cmd = [
        ffmpeg,
        "-hide_banner",
        "-y",
        "-i",
        str(src),
        "-c:v",
        "libvpx-vp9",
        "-crf",
        str(crf),
        "-b:v",
        "0",
        "-deadline",
        deadline,
        "-cpu-used",
        str(cpu_used),
        "-row-mt",
        "1",
        "-c:a",
        "libopus",
        "-b:a",
        audio_bitrate,
        str(dst),
    ]
    subprocess.run(cmd, check=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert MP4 files to WebM (high-quality VP9).")
    parser.add_argument(
        "--assets",
        type=Path,
        default=Path("assets"),
        help="Folder to scan for .mp4 files (default: ./assets)",
    )
    parser.add_argument(
        "--crf",
        type=int,
        default=28,
        help="VP9 CRF (lower = better quality, larger files). Suggested 24–32. Default: 28",
    )
    parser.add_argument(
        "--audio-bitrate",
        default="128k",
        help="Opus audio bitrate (default: 128k)",
    )
    parser.add_argument(
        "--deadline",
        default="good",
        choices=["good", "best", "realtime"],
        help="VP9 encoding effort (default: good; use best for slightly better quality, slower)",
    )
    parser.add_argument(
        "--cpu-used",
        type=int,
        default=1,
        help="VP9 speed/quality tradeoff 0-5 (lower = slower/better). Default: 1",
    )
    parser.add_argument(
        "--recursive",
        action="store_true",
        help="Scan subfolders under --assets",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print actions without converting",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing .webm files",
    )
    args = parser.parse_args()

    assets_dir: Path = args.assets.resolve()
    if not assets_dir.is_dir():
        sys.stderr.write(f"Error: assets folder not found: {assets_dir}\n")
        sys.exit(1)

    pattern = "**/*.mp4" if args.recursive else "*.mp4"
    mp4_files = sorted(assets_dir.glob(pattern))
    if not mp4_files:
        print(f"No .mp4 files found under {assets_dir}")
        sys.exit(0)

    ffmpeg = find_ffmpeg()
    print(f"Using ffmpeg: {ffmpeg}")
    print(f"Found {len(mp4_files)} file(s)")

    for src in mp4_files:
        dst = src.with_suffix(".webm")
        if dst.exists() and not args.overwrite and not args.dry_run:
            print(f"Skip (exists): {dst} — use --overwrite to replace")
            continue
        print(f"{'[dry-run] ' if args.dry_run else ''}{src} -> {dst}")
        if args.dry_run:
            continue
        try:
            convert_file(
                ffmpeg,
                src,
                dst,
                crf=args.crf,
                audio_bitrate=args.audio_bitrate,
                deadline=args.deadline,
                cpu_used=args.cpu_used,
            )
        except subprocess.CalledProcessError as e:
            sys.stderr.write(f"Failed: {src} (exit {e.returncode})\n")
            sys.exit(e.returncode)

    print("Done.")


if __name__ == "__main__":
    main()
