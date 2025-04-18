import { Grid2 as Grid, Box, Button, IconButton, Stack, Typography, ToggleButtonGroup, ToggleButton, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import useActionContext from '../../hooks/useActionContext';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SortIcon from '@mui/icons-material/Sort';
import RestoreIcon from '@mui/icons-material/Restore';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ActionTrack from './components/ActionTrack';
import { ActionIcon } from '../../components/CustomIcons';
import ActionTrackButtonV2 from './components/ActionTrackButtonV2';
import useLocalStorage from '../../hooks/useLocalStorage';
import { format } from 'date-fns';
import ActionTrackHistoryDialog from './dialogs/actions/ActionTrackHistoryDialog';
import ArchivedActionsDialog from './dialogs/actions/ArchivedActionsDialog';
import ActionDialogV2 from './dialogs/actions/ActionDialogV2';
import ActiveActionTrack from './components/ActiveActionTrack';
import SortActionsDialog from './dialogs/actions/SortActionsDialog';

type DialogType = 'CreateAction' | 'SortActions' | 'ArchivedActions' | 'ActionTrackHistory';

const MyWay = () => {
    const { isLoading: isLoadingActions, getActions, actions } = useActionContext();
    const { isLoading: isLoadingActionTrack, getActionTracks, actionTracksForTheDay, activeActionTracks, dailyAggregation } = useActionTrackContext();
    const { setActionTracksColumnsCount, getActionTracksColumnsCount } = useLocalStorage();
    const isLoading = isLoadingActions || isLoadingActionTrack;

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [actionTrackColumns, setActionTrackColumns] = useState<1 | 2 | 3>(getActionTracksColumnsCount());

    const getDialog = () => {
        switch (openedDialog) {
            case 'CreateAction':
                return <ActionDialogV2 onClose={() => setOpenedDialog(undefined)} />;
            case 'SortActions':
                return <SortActionsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchivedActions':
                return <ArchivedActionsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ActionTrackHistory':
                return <ActionTrackHistoryDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);

    useEffect(() => {
        if ([actionTracksForTheDay, activeActionTracks, dailyAggregation].some(x => x === undefined) && !isLoading) getActionTracks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksForTheDay, activeActionTracks, getActionTracks]);
    return (
        <>
            <Stack direction='row' justifyContent='space-between' pb={1}>
                <Stack direction='row' mt={0.5}>
                    <ActionIcon />
                    <Typography variant='h6' textAlign='left'>
                        活動
                    </Typography>
                </Stack>
                <Stack direction='row'>
                    <ToggleButtonGroup
                        value={actionTrackColumns}
                        size='small'
                        exclusive
                        onChange={(_, newValue) => {
                            setActionTracksColumnsCount(newValue);
                            setActionTrackColumns(newValue);
                        }}
                    >
                        <ToggleButton value={1}>
                            <TableRowsIcon />
                        </ToggleButton>
                        <ToggleButton value={2}>
                            <GridViewSharpIcon />
                        </ToggleButton>
                        <ToggleButton value={3}>
                            <ViewModuleIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <IconButton onClick={() => setOpenedDialog('SortActions')} aria-label='add' color='primary'>
                        <SortIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpenedDialog('ArchivedActions')} aria-label='add' color='primary'>
                        <RestoreIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpenedDialog('CreateAction')} aria-label='add' color='primary'>
                        <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                </Stack>
            </Stack>
            {isLoadingActions ? (
                <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
            ) : (
                actions && (
                    <Grid container spacing={1} sx={{ pb: 2 }}>
                        {actions
                            ?.filter(action => action.trackable)
                            .map(action => (
                                <ActionTrackButtonV2 key={action.id} action={action} columns={actionTrackColumns} />
                            ))}
                        {actions
                            ?.filter(action => !action.trackable)
                            .map(action => (
                                <ActionTrackButtonV2 key={action.id} action={action} columns={actionTrackColumns} disabled />
                            ))}
                    </Grid>
                )
            )}
            <Box>
                <Stack direction='row' justifyContent='space-between'>
                    <Typography>{format(new Date(), 'yyyy-MM-dd E')}</Typography>
                    <Button variant='text' onClick={() => setOpenedDialog('ActionTrackHistory')}>
                        全履歴表示
                    </Button>
                </Stack>
                {isLoadingActionTrack ? (
                    <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                ) : (
                    actionTracksForTheDay !== undefined &&
                    actionTracksForTheDay.length > 0 && (
                        <Grid container spacing={1}>
                            {actionTracksForTheDay.map(actionTrack => {
                                if (actionTrack.ended_at !== null) {
                                    return <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />;
                                }
                                return <div key={actionTrack.id} />;
                            })}
                        </Grid>
                    )
                )}
            </Box>
            {activeActionTracks && (
                <div style={{ paddingBottom: `${100 - 60 + activeActionTracks.length * 58}px` }}>
                    <Stack
                        sx={{
                            position: 'fixed',
                            bottom: '100px',
                            left: 0,
                            right: 0,
                            padding: 0.5,
                        }}
                        spacing={0.5}
                    >
                        {activeActionTracks?.map(actionTrack => (
                            <ActiveActionTrack key={`active-${actionTrack.id}`} actionTrack={actionTrack} />
                        ))}
                    </Stack>
                </div>
            )}
            {openedDialog && getDialog()}
        </>
    );
};

export default MyWay;
