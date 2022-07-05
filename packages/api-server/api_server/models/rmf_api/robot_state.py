# generated by datamodel-codegen:
#   filename:  robot_state.json

from __future__ import annotations

from enum import Enum
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field, confloat

from . import location_2D


class Status3(Enum):
    uninitialized = "uninitialized"
    offline = "offline"
    shutdown = "shutdown"
    idle = "idle"
    charging = "charging"
    working = "working"
    error = "error"


class Issue(BaseModel):
    category: Optional[str] = Field(None, description="Category of the robot's issue")
    detail: Optional[Union[Dict[str, Any], List, str]] = Field(
        None, description="Detailed information about the issue"
    )


class RobotState(BaseModel):
    name: Optional[str] = None
    status: Optional[Status3] = Field(
        None, description="A simple token representing the status of the robot"
    )
    task_id: Optional[str] = Field(
        None,
        description="The ID of the task this robot is currently working on. Empty string if the robot is not working on a task.",
    )
    unix_millis_time: Optional[int] = None
    location: Optional[location_2D.Location2D] = None
    battery: Optional[confloat(ge=0.0, le=1.0)] = Field(
        None,
        description="State of charge of the battery. Values range from 0.0 (depleted) to 1.0 (fully charged)",
    )
    issues: Optional[List[Issue]] = Field(
        None,
        description="A list of issues with the robot that operators need to address",
    )
