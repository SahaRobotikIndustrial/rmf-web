import React from 'react';
import { Divider, Grid, Paper, PaperProps, styled, Typography, useTheme } from '@mui/material';
import { format } from 'date-fns';

const prefix = 'task-logs';
const classes = {
  root: `${prefix}-root`,
};
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

export function TaskLogs() {
  const theme = useTheme();
  const mockLogs = [
    {
      event: 'Pick Up',
      phases: [
        {
          phaseName: 'Go To Kitchen',
          logs: [
            { date: format(new Date(), 'MM/dd/yyyy HH:mm'), msg: 'message 1' },
            { date: format(new Date(), 'MM/dd/yyyy HH:mm'), msg: 'message 2' },
            { date: format(new Date(), 'MM/dd/yyyy HH:mm'), msg: 'message 3' },
          ],
        },
        {
          phaseName: 'Wait for Kitchen Door to Open',
          logs: [
            { date: format(new Date(), 'MM/dd/yyyy HH:mm'), msg: 'message 1' },
            { date: format(new Date(), 'MM/dd/yyyy HH:mm'), msg: 'message 2' },
            { date: format(new Date(), 'MM/dd/yyyy HH:mm'), msg: 'message 3' },
          ],
        },
        {
          phaseName: 'Pass through Kitchen Door',
          logs: [
            { date: format(new Date(), 'MM/dd/yyyy HH:mm'), msg: 'message 1' },
            { date: format(new Date(), 'MM/dd/yyyy HH:mm'), msg: 'message 2' },
            { date: format(new Date(), 'MM/dd/yyyy HH:mm'), msg: 'message 3' },
          ],
        },
        {
          phaseName: 'Receive Items',
          logs: [
            { date: format(new Date(), 'MM/dd/yyyy HH:mm'), msg: 'message 1' },
            { date: format(new Date(), 'MM/dd/yyyy HH:mm'), msg: 'message 2' },
            { date: format(new Date(), 'MM/dd/yyyy HH:mm'), msg: 'message 3' },
          ],
        },
      ],
    },
  ];
  return (
    <StyledPaper className={classes.root}>
      <Typography variant="h6" style={{ textAlign: 'center' }} gutterBottom>
        Temp Task Logs
      </Typography>
      <Divider />
      {mockLogs.map((log, i) => {
        return (
          <div style={{ marginTop: theme.spacing(1) }}>
            <Typography variant="body1">{`${i + 1}. ${log.event}`}</Typography>
            <Paper sx={{ padding: theme.spacing(1) }}>
              {log.phases.map((l) => {
                return (
                  <div style={{ marginTop: theme.spacing(1) }}>
                    <Typography variant="body1" fontWeight="bold">
                      {l.phaseName}
                    </Typography>
                    <Grid container spacing={1}>
                      {l.logs.map((msg) => {
                        return (
                          <>
                            <Grid item xs={4}>
                              <Typography variant="body1">{msg.date}</Typography>
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="body1">{msg.msg}</Typography>
                            </Grid>
                          </>
                        );
                      })}
                    </Grid>
                  </div>
                );
              })}
            </Paper>
          </div>
        );
      })}
    </StyledPaper>
  );
}
