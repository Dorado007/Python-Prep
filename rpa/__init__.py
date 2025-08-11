"""Simple RPA framework inspired by Rocketbot style."""

from .actions import action, get_action, Action, Delay, Log
from .workflow import Workflow
from .loader import load_workflow

__all__ = [
    "action",
    "get_action",
    "Action",
    "Delay",
    "Log",
    "Workflow",
    "load_workflow",
]
