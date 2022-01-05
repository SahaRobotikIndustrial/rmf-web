import React from 'react';
import { Divider, Grid, Paper, PaperProps, styled, Typography, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { TaskEventLog, TaskState } from 'api-client';

const prefix = 'task-logs';
const classes = {
  root: `${prefix}-root`,
};

interface TaskLogProps {
  taskLog: TaskEventLog;
  fetchTaskLogs?: () => Promise<never[] | undefined>;
}

const StyledPaper = styled((props: PaperProps) => <Paper variant="outlined" {...props} />)(
  ({ theme }) => ({
    [`&.${classes.root}`]: {
      padding: theme.spacing(2),
      width: 350,
      marginLeft: theme.spacing(2),
      flex: '0 0 auto',
    },
  }),
);

export function TaskLogs(props: TaskLogProps) {
  const { taskLog } = props;
  const theme = useTheme();
  const phaseIds = taskLog.phases ? Object.keys(taskLog.phases) : [];
  return (
    <StyledPaper className={classes.root}>
      <Typography variant="h6" style={{ textAlign: 'center' }} gutterBottom>
        {taskLog.task_id}
      </Typography>
      <Divider />
      {phaseIds.map((id: string) => {
        const getEventObj: any = taskLog.phases ? taskLog.phases[id] : null;
        const events = getEventObj ? getEventObj['events'] : {};
        const eventIds = events ? Object.keys(events) : [];
        return (
          <Paper sx={{ padding: theme.spacing(1) }} key={`Phase - ${id}`}>
            <Typography variant="body1" fontWeight="bold">
              {`Phase - ${id}`}
            </Typography>
            {eventIds.map((idx) => {
              const event = events[idx];
              return event.map((e: any, i: any) => {
                return (
                  <div style={{ marginTop: theme.spacing(1) }} key={`event - ${idx}`}>
                    <Typography variant="body1">{`${i + 1}. Event - ${idx}`}</Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="body1">
                          {format(new Date(e.unix_millis_time * 1000), "hh:mm aaaaa'm'")}
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body1">{e.text}</Typography>
                      </Grid>
                    </Grid>
                  </div>
                );
              });
            })}
          </Paper>
        );
      })}
    </StyledPaper>
  );
}
