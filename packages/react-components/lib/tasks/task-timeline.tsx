import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineProps,
} from '@mui/lab';
import { TaskState, Phase } from 'api-client';
import React from 'react';

interface TimeLinePropsWithRef extends TimelineProps {
  ref?: React.RefObject<HTMLUListElement>;
}

const classes = {
  paper: 'timeline-paper',
  secondaryTail: 'timeline-secondary-tail',
  pendingPhase: 'timeline-pending-phase',
  completedPhase: 'timeline-completed-phase',
  failedPhase: 'timeline-failed-phase',
  timelineRoot: 'timeline-root',
};
const StyledTimeLine = styled((props: TimeLinePropsWithRef) => <Timeline {...props} />)(
  ({ theme }) => ({
    [`& .${classes.paper}`]: {
      padding: '6px 16px',
      width: '200px',
      maxHeight: '100px',
      overflow: 'auto',
      display: 'inline-block',
    },
    [`& .${classes.secondaryTail}`]: {
      backgroundColor: theme.palette.secondary.main,
    },
    [`& .${classes.pendingPhase}`]: {
      background: theme.palette.info.light,
    },
    [`& .${classes.completedPhase}`]: {
      background: theme.palette.success.light,
    },
    [`& .${classes.failedPhase}`]: {
      background: theme.palette.error.light,
    },
    [`&.${classes.timelineRoot}`]: {
      padding: '6px 0px',
    },
  }),
);

export interface TaskTimelineProps {
  taskState: TaskState;
}

export function TaskTimeline({ taskState }: TaskTimelineProps): JSX.Element | null {
  const timelinePhases = taskState.phases;

  function getTimeLineDotProps(taskState: TaskState, taskPhase: Phase) {
    if (taskState.completed?.includes(taskPhase.id)) return { className: classes.completedPhase };
    if (taskPhase.id === taskState.active) return { className: classes.completedPhase };
    if (taskState.pending?.includes(taskPhase.id)) return { className: classes.completedPhase };
    else {
      return { className: classes.failedPhase };
    }
  }

  return timelinePhases ? (
    <StyledTimeLine position="left" className={classes.timelineRoot}>
      {Object.keys(timelinePhases).map((phase: string, idx: number) => {
        const estimatedTime = timelinePhases[phase].estimate_millis;
        return (
          <TimelineItem key={idx}>
            <TimelineOppositeContent style={{ flex: 0.1, padding: '0px 12px 0px 0px' }}>
              <Typography variant="overline" color="textSecondary" style={{ textAlign: 'justify' }}>
                {estimatedTime ? new Date(estimatedTime * 1000).toISOString().slice(11, -1) : null}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot {...getTimeLineDotProps(taskState, timelinePhases[phase])} />
              {idx < Object.keys(timelinePhases).length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Paper className={classes.paper}>
                <Typography variant="caption">{timelinePhases[phase].detail}</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </StyledTimeLine>
  ) : null;
}
