import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Grid,
  IconButton,
  TableContainer,
  TablePagination,
  Toolbar,
  Tooltip,
  useTheme,
} from '@mui/material';
import { TaskRequest, TaskState, Status } from 'api-client';
import React from 'react';
import {
  CreateTaskForm,
  CreateTaskFormProps,
  getPlaces,
  TaskTable,
  Window,
} from 'react-components';
import { Subscription } from 'rxjs';
import { AppControllerContext, ResourcesContext } from '../app-contexts';
import { AppEvents } from '../app-events';
import { MicroAppProps } from '../micro-app';
import { RmfAppContext } from '../rmf-app';
import { parseTasksFile } from './utils';

const ActiveStates = [Status.Queued, Status.Underway];

const ActiveTasks = () => {
  const rmf = React.useContext(RmfAppContext);
  const [taskStates, setTaskStates] = React.useState<Record<string, TaskState>>({});

  React.useEffect(() => {
    if (!rmf) {
      return;
    }
    const subs: Subscription[] = [];
    (async () => {
      const resp = await rmf.tasksApi.getActiveTasksTasksActiveTasksGet();
      const newTasks = resp.data as TaskState[];
      subs.push(
        ...newTasks.map((taskState) =>
          rmf.getTaskStateObs(taskState.booking.id).subscribe((newState) => {
            if (newState.status && newState.status in ActiveStates) {
              setTaskStates((prev) => ({ ...prev, [newState.booking.id]: newState }));
            } else {
              setTaskStates((prev) => {
                delete prev[newState.booking.id];
                return { ...prev };
              });
            }
          }),
        ),
      );
    })();
    return () => subs.forEach((s) => s.unsubscribe());
  }, [rmf]);

  React.useEffect(() => {
    if (!rmf) {
      return;
    }
    const sub = rmf.newTasksObs.subscribe((taskState) =>
      setTaskStates((prev) => ({ ...prev, [taskState.booking.id]: taskState })),
    );
    return () => sub.unsubscribe();
  }, [rmf]);

  return (
    <Grid container wrap="nowrap" direction="column" height="100%">
      <Grid item flexGrow={1}>
        <TableContainer>
          <TaskTable
            tasks={Object.values(taskStates)}
            onTaskClick={(_ev, task) => AppEvents.taskSelect.next(task)}
          />
        </TableContainer>
      </Grid>
    </Grid>
  );
};

const TaskHistory = () => {
  const rmf = React.useContext(RmfAppContext);
  const [taskStates, setTaskStates] = React.useState<Record<string, TaskState>>({});
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);

  React.useEffect(() => {
    if (!rmf) {
      return;
    }
    const subs: Subscription[] = [];
    (async () => {
      const resp = await rmf.tasksApi.queryTaskStatesTasksGet(
        undefined,
        undefined,
        undefined,
        undefined,
        11,
        page * 10,
        '-unix_millis_start_time',
        undefined,
      );
      const results = resp.data as TaskState[];
      setHasMore(results.length > 10);
      const newTasks = results.slice(0, 10);

      setTaskStates(
        newTasks.reduce<Record<string, TaskState>>((acc, task) => {
          acc[task.booking.id] = task;
          return acc;
        }, {}),
      );
      subs.push(
        ...newTasks.map((task) =>
          rmf
            .getTaskStateObs(task.booking.id)
            .subscribe((task) => setTaskStates((prev) => ({ ...prev, [task.booking.id]: task }))),
        ),
      );
    })();
    return () => subs.forEach((s) => s.unsubscribe());
  }, [rmf, page]);

  return (
    <Grid container wrap="nowrap" direction="column" height="100%">
      <Grid item flexGrow={1}>
        <TableContainer>
          <TaskTable
            tasks={Object.values(taskStates)}
            onTaskClick={(_ev, task) => AppEvents.taskSelect.next(task)}
          />
        </TableContainer>
      </Grid>
      <Grid item>
        <TablePagination
          component="div"
          page={page}
          count={hasMore ? -1 : page * 10 + Object.keys(taskStates).length}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
          onPageChange={(_ev, page) => setPage(page)}
          style={{ flex: '0 0 auto' }}
        />
      </Grid>
    </Grid>
  );
};

export const TasksApp = React.memo(
  React.forwardRef(
    (
      { onClose, children, ...otherProps }: React.PropsWithChildren<MicroAppProps>,
      ref: React.Ref<HTMLDivElement>,
    ) => {
      const rmf = React.useContext(RmfAppContext);
      const theme = useTheme();

      const [mode, setMode] = React.useState<'active' | 'history'>('active');
      const [forceRefresh, setForceRefresh] = React.useState(0);

      const uploadFileInputRef = React.useRef<HTMLInputElement>(null);
      const [openCreateTaskForm, setOpenCreateTaskForm] = React.useState(false);
      const { showAlert } = React.useContext(AppControllerContext);

      const tasksFromFile = (): Promise<TaskRequest[]> => {
        return new Promise((res) => {
          const fileInputEl = uploadFileInputRef.current;
          if (!fileInputEl) {
            return [];
          }
          let taskFiles: TaskRequest[];
          const listener = async () => {
            try {
              if (!fileInputEl.files || fileInputEl.files.length === 0) {
                return res([]);
              }
              try {
                taskFiles = parseTasksFile(await fileInputEl.files[0].text());
              } catch (err) {
                showAlert('error', (err as Error).message, 5000);
                return res([]);
              }
              // only submit tasks when all tasks are error free
              return res(taskFiles);
            } finally {
              fileInputEl.removeEventListener('input', listener);
              fileInputEl.value = '';
            }
          };
          fileInputEl.addEventListener('input', listener);
          fileInputEl.click();
        });
      };

      const [placeNames, setPlaceNames] = React.useState<string[]>([]);
      React.useEffect(() => {
        if (!rmf) {
          return;
        }
        const sub = rmf.buildingMapObs.subscribe((map) =>
          setPlaceNames(getPlaces(map).map((p) => p.vertex.name)),
        );
        return () => sub.unsubscribe();
      }, [rmf]);

      const resourceManager = React.useContext(ResourcesContext);

      const [workcells, setWorkcells] = React.useState<string[]>();
      React.useEffect(() => {
        if (!resourceManager?.dispensers) {
          return;
        }
        setWorkcells(Object.keys(resourceManager.dispensers.dispensers));
      }, [resourceManager]);

      const submitTasks = React.useCallback<Required<CreateTaskFormProps>['submitTasks']>(
        async (taskRequests) => {
          if (!rmf) {
            throw new Error('tasks api not available');
          }
          await Promise.all(
            taskRequests.map((taskReq) =>
              rmf.tasksApi.postDispatchTaskTasksDispatchTaskPost({
                type: 'dispatch_task_request',
                request: taskReq,
              }),
            ),
          );
          setForceRefresh((prev) => prev + 1);
        },
        [rmf],
      );

      const appTitle = mode === 'active' ? 'Active Tasks' : 'Task History';
      const activeHistoryTitle = mode === 'active' ? 'History' : 'Active';

      return (
        <Window
          ref={ref}
          title={appTitle}
          onClose={onClose}
          toolbar={
            <Toolbar variant="dense">
              {mode === 'history' && (
                <Tooltip title="Refresh" color="inherit">
                  <IconButton
                    onClick={() => setForceRefresh((prev) => prev + 1)}
                    aria-label="Refresh"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={activeHistoryTitle} color="inherit">
                <IconButton
                  sx={
                    mode === 'history' ? { background: theme.palette.action.selected } : undefined
                  }
                  onClick={() => {
                    setMode((prev) => {
                      if (prev === 'active') {
                        return 'history';
                      }
                      return 'active';
                    });
                  }}
                  aria-label={activeHistoryTitle}
                >
                  <HistoryIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Create task" color="inherit">
                <IconButton onClick={() => setOpenCreateTaskForm(true)} aria-label="Create Task">
                  <AddOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
          }
          {...otherProps}
        >
          {mode === 'active' && <ActiveTasks />}
          {mode === 'history' && <TaskHistory key={forceRefresh} />}
          {openCreateTaskForm && (
            <CreateTaskForm
              cleaningZones={placeNames}
              loopWaypoints={placeNames}
              deliveryWaypoints={placeNames}
              dispensers={workcells}
              ingestors={workcells}
              open={openCreateTaskForm}
              onClose={() => setOpenCreateTaskForm(false)}
              submitTasks={submitTasks}
              tasksFromFile={tasksFromFile}
              onSuccess={() => {
                setOpenCreateTaskForm(false);
                showAlert('success', 'Successfully created task');
              }}
              onFail={(e) => {
                showAlert('error', `Failed to create task: ${e.message}`);
              }}
            />
          )}
          <input type="file" style={{ display: 'none' }} ref={uploadFileInputRef} />
          {children}
        </Window>
      );
    },
  ),
);
