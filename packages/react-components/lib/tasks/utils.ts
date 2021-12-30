import { TaskSummary as RmfTaskSummary, TaskType as RmfTaskType } from 'rmf-models';
import type { TaskState } from 'api-client';

export function taskStateToStr(state: number): string {
  switch (state) {
    case RmfTaskSummary.STATE_ACTIVE:
      return 'Active';
    case RmfTaskSummary.STATE_CANCELED:
      return 'Cancelled';
    case RmfTaskSummary.STATE_COMPLETED:
      return 'Completed';
    case RmfTaskSummary.STATE_FAILED:
      return 'Failed';
    case RmfTaskSummary.STATE_PENDING:
      return 'Pending';
    case RmfTaskSummary.STATE_QUEUED:
      return 'Queued';
    default:
      return 'Unknown';
  }
}

export function taskTypeToStr(taskType: number): string {
  switch (taskType) {
    case RmfTaskType.TYPE_CHARGE_BATTERY:
      return 'Charge';
    case RmfTaskType.TYPE_CLEAN:
      return 'Clean';
    case RmfTaskType.TYPE_DELIVERY:
      return 'Delivery';
    case RmfTaskType.TYPE_LOOP:
      return 'Loop';
    case RmfTaskType.TYPE_PATROL:
      return 'Patrol';
    case RmfTaskType.TYPE_STATION:
      return 'Station';
    default:
      return 'Unknown';
  }
}

function parsePhaseDetail(phases: TaskState['phases'], category?: string) {
  if (phases) {
    if (category === 'Loop') {
      const startPhase = phases['1'];
      const endPhase = phases['2'];
      const from = startPhase.category?.split('[place:')[1].split(']')[0];
      const to = endPhase.category?.split('[place:')[1].split(']')[0];
      return { to, from };
    }
  }
  return {};
}

export function parseTaskDetail(task: TaskState, category?: string) {
  switch (category) {
    case 'Loop':
      return parsePhaseDetail(task.phases, category);
    default:
      return {};
  }
}

export function getState(task: TaskState) {
  // TODO - handle killed and cancelled states
  if (task.phases && task.completed?.length === Object.keys(task.phases).length) return 'Completed';
  if (task.active) return 'Underway';
  return '';
}

export function getTreeViewHeader(category: TaskState['category']) {
  switch (category) {
    case 'Loop':
      return 'Loop Sequence';
    case 'Clean':
      return 'Clean Sequence';
    case 'Delivery':
    // TODO - not sure about return structure,
    // once able to receive delivery task
    // come back again.
    default:
      return '';
  }
}
