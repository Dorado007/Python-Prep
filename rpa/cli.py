"""Command line interface for running workflows."""

from __future__ import annotations

import argparse

from .loader import load_workflow


def main() -> None:
    parser = argparse.ArgumentParser(description="Simple RPA runner")
    parser.add_argument("script", help="Path to JSON workflow definition")
    args = parser.parse_args()
    workflow = load_workflow(args.script)
    workflow.run()


if __name__ == "__main__":
    main()
