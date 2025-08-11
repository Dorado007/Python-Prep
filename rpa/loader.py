"""Utility to load workflows from JSON definitions."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, Iterable

from .actions import get_action
from .workflow import Workflow


def load_workflow(path: str | Path) -> Workflow:
    """Load a workflow from a JSON file."""
    with open(path, "r", encoding="utf-8") as fh:
        data: Iterable[Dict[str, Any]] = json.load(fh)
    wf = Workflow()
    for step in data:
        action_name: str = step["action"]
        args: Dict[str, Any] = step.get("args", {})
        action_cls = get_action(action_name)
        wf.add_step(action_cls(**args))
    return wf
