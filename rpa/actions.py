"""Definitions of actions available to robots."""

from __future__ import annotations

import time
from abc import ABC, abstractmethod
from typing import Any, Callable, Dict, Type

_action_registry: Dict[str, Type["Action"]] = {}


def action(name: str) -> Callable[[Type["Action"]], Type["Action"]]:
    """Register an action class under *name*.

    Decorator used for plugin-style registration of actions.
    """

    def decorator(cls: Type["Action"]) -> Type["Action"]:
        _action_registry[name] = cls
        return cls

    return decorator


def get_action(name: str) -> Type["Action"]:
    """Retrieve an action class previously registered."""
    try:
        return _action_registry[name]
    except KeyError as exc:
        raise KeyError(f"Unknown action: {name}") from exc


class Action(ABC):
    """Base class for all actions."""

    @abstractmethod
    def run(self, context: Dict[str, Any]) -> None:
        """Execute the action."""


@action("log")
class Log(Action):
    """Print a message to stdout."""

    def __init__(self, message: str) -> None:
        self.message = message

    def run(self, context: Dict[str, Any]) -> None:  # pragma: no cover - simple print
        print(self.message)


@action("delay")
class Delay(Action):
    """Pause execution for a number of *seconds*."""

    def __init__(self, seconds: float) -> None:
        self.seconds = seconds

    def run(self, context: Dict[str, Any]) -> None:
        time.sleep(self.seconds)
