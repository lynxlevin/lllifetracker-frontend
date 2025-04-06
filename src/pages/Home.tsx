import styled from '@emotion/styled';
import { Grid2 as Grid, Box, Button, Divider, IconButton, Stack, Typography, Paper, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import BasePage from '../components/BasePage';
import useActionTrackContext from '../hooks/useActionTrackContext';
import useActionContext from '../hooks/useActionContext';
import ActiveActionTracks from './ActionTracks/ActiveActionTracks';
import useAmbitionContext from '../hooks/useAmbitionContext';
import useDesiredStateContext from '../hooks/useDesiredStateContext';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import RestoreIcon from '@mui/icons-material/Restore';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import TimerIcon from '@mui/icons-material/Timer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AmbitionDialog from './MyWay/Ambitions/Dialogs/AmbitionDialog';
import DesiredStateDialog from './MyWay/DesiredStates/Dialogs/DesiredStateDialog';
import type { Ambition } from '../types/ambition';
import type { DesiredState } from '../types/desired_state';
import type { Action } from '../types/action';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ActionTrack from './ActionTracks/ActionTrack';
import { ActionIcon, AmbitionIcon, DesiredStateIcon } from '../components/CustomIcons';
import ActionTrackButtonV2 from './ActionTracks/ActionTrackButtonV2';
import useLocalStorage from '../hooks/useLocalStorage';
import { format } from 'date-fns';
import ActionTrackHistoryDialog from './ActionTracks/Dialogs/ActionTrackHistoryDialog';
import ArchivedAmbitionsDialog from './MyWay/Ambitions/Dialogs/ArchivedAmbitionsDialog';
import ArchivedActionsDialog from './MyWay/Actions/Dialogs/ArchivedActionsDialog';
import ArchivedDesiredStatesDialog from './MyWay/DesiredStates/Dialogs/ArchivedDesiredStatesDialog';
import ActionDialogV2 from './MyWay/Actions/Dialogs/ActionDialogV2';

type DialogType =
    | 'CreateAmbition'
    | 'EditAmbition'
    | 'ArchiveAmbition'
    | 'ArchivedAmbitions'
    | 'CreateDesiredState'
    | 'EditDesiredState'
    | 'ArchiveDesiredState'
    | 'ArchivedDesiredStates'
    | 'CreateAction'
    | 'ArchivedActions'
    | 'ActionTrackHistory';

const Home = () => {
    const { isLoading: isLoadingAmbitions, getAmbitions, ambitions, archiveAmbition } = useAmbitionContext();
    const { isLoading: isLoadingDesiredStates, getDesiredStates, desiredStates, archiveDesiredState } = useDesiredStateContext();
    const { isLoading: isLoadingActions, getActions, actions } = useActionContext();
    const { isLoading: isLoadingActionTrack, getActionTracks, actionTracksForTheDay, activeActionTracks, dailyAggregation } = useActionTrackContext();
    const { setActionTracksColumnsCount, getActionTracksColumnsCount } = useLocalStorage();
    const isLoading = isLoadingAmbitions || isLoadingDesiredStates || isLoadingActions || isLoadingActionTrack;

    const trackButtonsRef = useRef<HTMLHRElement | null>(null);
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [selectedObject, setSelectedObject] = useState<Ambition | DesiredState | Action>();
    const [actionTrackColumns, setActionTrackColumns] = useState<1 | 2 | 3>(getActionTracksColumnsCount());

    const getDialog = () => {
        switch (openedDialog) {
            case 'CreateAmbition':
                return <AmbitionDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'EditAmbition':
                return (
                    <AmbitionDialog
                        ambition={selectedObject as Ambition}
                        onClose={() => {
                            setSelectedObject(undefined);
                            setOpenedDialog(undefined);
                        }}
                    />
                );
            case 'ArchiveAmbition':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setSelectedObject(undefined);
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            archiveAmbition((selectedObject as Ambition).id);
                            setSelectedObject(undefined);
                            setOpenedDialog(undefined);
                        }}
                        title='大望：アーカイブ'
                        message={`「${(selectedObject as Ambition).name}」をアーカイブします。`}
                        actionName='アーカイブする'
                    />
                );
            case 'ArchivedAmbitions':
                return <ArchivedAmbitionsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'CreateDesiredState':
                return <DesiredStateDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'EditDesiredState':
                return (
                    <DesiredStateDialog
                        desiredState={selectedObject as DesiredState}
                        onClose={() => {
                            setSelectedObject(undefined);
                            setOpenedDialog(undefined);
                        }}
                    />
                );
            case 'ArchiveDesiredState':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setSelectedObject(undefined);
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            archiveDesiredState((selectedObject as DesiredState).id);
                            setSelectedObject(undefined);
                            setOpenedDialog(undefined);
                        }}
                        title='望む姿：アーカイブ'
                        message={`「${(selectedObject as DesiredState).name}」をアーカイブします。`}
                        actionName='アーカイブする'
                    />
                );
            case 'ArchivedDesiredStates':
                return <ArchivedDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'CreateAction':
                return <ActionDialogV2 onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchivedActions':
                return <ArchivedActionsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ActionTrackHistory':
                return <ActionTrackHistoryDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        if (ambitions === undefined && !isLoading) getAmbitions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitions, getAmbitions]);

    useEffect(() => {
        if (desiredStates === undefined && !isLoading) getDesiredStates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStates, getDesiredStates]);

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);

    useEffect(() => {
        if ([actionTracksForTheDay, activeActionTracks, dailyAggregation].some(x => x === undefined) && !isLoading) getActionTracks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksForTheDay, activeActionTracks, getActionTracks]);
    return (
        <BasePage isLoading={isLoading} pageName='Home'>
            <Box sx={{ pt: 4 }}>
                <Stack direction='row' justifyContent='space-between'>
                    <Stack direction='row' mt={0.5}>
                        <AmbitionIcon />
                        <Typography variant='h6' textAlign='left'>
                            大望 / 生きる意義
                        </Typography>
                    </Stack>
                    <Stack direction='row'>
                        <IconButton onClick={() => setOpenedDialog('ArchivedAmbitions')} aria-label='add' color='primary'>
                            <RestoreIcon />
                        </IconButton>
                        <IconButton onClick={() => setOpenedDialog('CreateAmbition')} aria-label='add' color='primary'>
                            <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                    </Stack>
                </Stack>
                <Stack spacing={1} sx={{ textAlign: 'left' }}>
                    {ambitions?.map(ambition => {
                        return (
                            <Paper key={ambition.id} sx={{ py: 1, px: 2 }}>
                                <Stack direction='row' justifyContent='space-between'>
                                    <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                                        {ambition.name}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size='small'
                                            onClick={() => {
                                                setSelectedObject(ambition);
                                                setOpenedDialog('EditAmbition');
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size='small'
                                            onClick={() => {
                                                setSelectedObject(ambition);
                                                setOpenedDialog('ArchiveAmbition');
                                            }}
                                        >
                                            <ArchiveIcon />
                                        </IconButton>
                                    </Box>
                                </Stack>
                                <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                    {ambition.description}
                                </Typography>
                            </Paper>
                        );
                    })}
                </Stack>
                <Divider color='#ccc' sx={{ my: 1 }} />
                <Stack direction='row' justifyContent='space-between'>
                    <Stack direction='row' mt={0.5}>
                        <DesiredStateIcon />
                        <Typography variant='h6' textAlign='left'>
                            目指す姿 / 指針
                        </Typography>
                    </Stack>
                    <Stack direction='row'>
                        <IconButton onClick={() => setOpenedDialog('ArchivedDesiredStates')} aria-label='add' color='primary'>
                            <RestoreIcon />
                        </IconButton>
                        <IconButton onClick={() => setOpenedDialog('CreateDesiredState')} aria-label='add' color='primary'>
                            <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                    </Stack>
                </Stack>
                <Stack spacing={1} sx={{ textAlign: 'left' }}>
                    {desiredStates?.map(desiredState => {
                        return (
                            <Paper key={desiredState.id} sx={{ py: 1, px: 2 }}>
                                <Stack direction='row' justifyContent='space-between'>
                                    <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                                        {desiredState.name}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size='small'
                                            onClick={() => {
                                                setSelectedObject(desiredState);
                                                setOpenedDialog('EditDesiredState');
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size='small'
                                            onClick={() => {
                                                setSelectedObject(desiredState);
                                                setOpenedDialog('ArchiveDesiredState');
                                            }}
                                        >
                                            <ArchiveIcon />
                                        </IconButton>
                                    </Box>
                                </Stack>
                                <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                    {desiredState.description}
                                </Typography>
                            </Paper>
                        );
                    })}
                </Stack>
                <Divider color='#ccc' sx={{ my: 1 }} ref={trackButtonsRef} />
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
                        <IconButton onClick={() => setOpenedDialog('ArchivedActions')} aria-label='add' color='primary'>
                            <RestoreIcon />
                        </IconButton>
                        <IconButton onClick={() => setOpenedDialog('CreateAction')} aria-label='add' color='primary'>
                            <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                    </Stack>
                </Stack>
                {actions && (
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
                )}
                <Box>
                    <Stack direction='row' justifyContent='space-between'>
                        <Typography>{format(new Date(), 'yyyy-MM-dd E')}</Typography>
                        <Button variant='text' onClick={() => setOpenedDialog('ActionTrackHistory')}>
                            全履歴表示
                        </Button>
                    </Stack>
                    {actionTracksForTheDay !== undefined && actionTracksForTheDay.length > 0 && (
                        <Grid container spacing={1}>
                            {actionTracksForTheDay.map(actionTrack => {
                                if (actionTrack.ended_at !== null) {
                                    return <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />;
                                }
                                return <div key={actionTrack.id} />;
                            })}
                        </Grid>
                    )}
                </Box>
                {activeActionTracks && <ActiveActionTracks activeActionTracks={activeActionTracks} bottom={100} />}
                {openedDialog && getDialog()}
                <ToLastAvailableTicketButton
                    onClick={() => {
                        trackButtonsRef.current && window.scrollTo({ top: trackButtonsRef.current.offsetTop - 50, behavior: 'smooth' });
                    }}
                >
                    <TimerIcon className='timer-icon' />
                    <ArrowDropDownIcon className='timer-arrow-icon' />
                </ToLastAvailableTicketButton>
            </Box>
        </BasePage>
    );
};

const ToLastAvailableTicketButton = styled(IconButton)`
    font-size: 30px;
    background: white !important;
    border-radius: 999px;
    position: fixed;
    left: 16px;
    bottom: 60px;
    border: 2px solid #ddd;
    width: 40px;
    height: 40px;
    z-index: 100;

    .timer-icon {
        position: fixed;
        left: 24px;
        bottom: 70px;
    }

    .timer-arrow-icon {
        position: fixed;
        left: 24px;
        bottom: 57px;
    }
`;

export default Home;
