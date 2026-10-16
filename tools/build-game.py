#!/usr/bin/env python3
"""Build game/game.js from the part files in game/src/.

The game engine is one big closure, so it cannot be loaded as separate
<script> files. Instead it is kept as small, named parts in game/src/ (joined
in filename order) and this script joins them into game/game.js.

    python tools/build-game.py           rebuild game/game.js
    python tools/build-game.py --check   exit 1 if game/game.js is out of date
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "game" / "src"
OUT = ROOT / "game" / "game.js"
HEADER = "/* GENERATED from game/src/*.js by tools/build-game.py - edit the parts, not this file. */\n"


def build():
    parts = sorted(SRC.glob("*.js"))
    if not parts:
        sys.exit("no part files in game/src/")
    body = "".join(p.read_text(encoding="utf-8").replace("\r\n", "\n") for p in parts)
    return HEADER + body


def main():
    text = build()
    if "--check" in sys.argv:
        current = OUT.read_text(encoding="utf-8").replace("\r\n", "\n") if OUT.exists() else ""
        if current != text:
            sys.exit("game/game.js is out of date - run: python tools/build-game.py")
        print("game/game.js is up to date")
        return
    OUT.write_text(text, encoding="utf-8", newline="\n")
    print(f"built game/game.js from {len(list(SRC.glob('*.js')))} parts ({len(text)} bytes)")


if __name__ == "__main__":
    main()
