#!/usr/bin/env python3
"""Local R&D server: test the site without pushing anything.

    python tools/dev-server.py            serve on http://localhost:8123
    python tools/dev-server.py 9000       use another port

- Rebuilds game/game.js from game/src/ every time the browser asks for it, so
  after editing a part you only need to refresh the page.
- Sends no-cache headers, so refreshes always show the latest files.
"""
import importlib.util
import pathlib
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = pathlib.Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("build_game", ROOT / "tools" / "build-game.py")
build_game = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build_game)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path.split("?")[0].endswith("/game/game.js"):
            text = build_game.build()
            out = build_game.OUT
            current = out.read_text(encoding="utf-8").replace("\r\n", "\n") if out.exists() else ""
            if current != text:
                out.write_text(text, encoding="utf-8", newline="\n")
                print("rebuilt game/game.js")
        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8123
    print(f"R&D server: http://localhost:{port}  (Ctrl+C to stop)")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
