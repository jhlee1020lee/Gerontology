import subprocess
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
BUILD_SCRIPT = ROOT_DIR / "scripts" / "build_site.js"


def main() -> int:
    if not BUILD_SCRIPT.exists():
        print(f"[missing] {BUILD_SCRIPT}", file=sys.stderr)
        return 1
    result = subprocess.run(["node", str(BUILD_SCRIPT), *sys.argv[1:]], cwd=ROOT_DIR)
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())
