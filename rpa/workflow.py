"""Execution engine for workflows."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List

from .actions import Action


@dataclass
class Workflow:
    """A sequence of actions to be executed."""

    steps: List[Action] = field(default_factory=list)

    def add_step(self, action: Action) -> None:
        self.steps.append(action)

    def run(self, context: Dict[str, any] | None = None) -> None:
        ctx: Dict[str, any] = context or {}
        for action in self.steps:
            action.run(ctx)
