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
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AmbitionDialog from './MyWay/Ambitions/Dialogs/AmbitionDialog';
import DesiredStateDialog from './MyWay/DesiredStates/Dialogs/DesiredStateDialog';
import type { Ambition } from '../types/ambition';
import type { DesiredState } from '../types/desired_state';
import type { Action } from '../types/action';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ActionTrack from './ActionTracks/ActionTrack';
import { ActionIcon, AmbitionIcon, DesiredStateIcon } from '../components/CustomIcons';
import ActionDialog from './MyWay/Actions/Dialogs/ActionDialog';
import ActionTrackButtonV2 from './ActionTracks/ActionTrackButtonV2';

type DialogType = 'CreateAmbition' | 'EditAmbition' | 'ArchiveAmbition' | 'CreateDesiredState' | 'EditDesiredState' | 'ArchiveDesiredState' | 'CreateAction';

const Home = () => {
    const { isLoading: isLoadingAmbitions, getAmbitions, ambitions, archiveAmbition } = useAmbitionContext();
    const { isLoading: isLoadingDesiredStates, getDesiredStates, desiredStates, archiveDesiredState } = useDesiredStateContext();
    const { isLoading: isLoadingActions, getActions, actions } = useActionContext();
    const { isLoading: isLoadingActionTrack, getActionTracksForHome, actionTracksForTheDay, activeActionTracks, dailyAggregation } = useActionTrackContext();
    const isLoading = isLoadingAmbitions || isLoadingDesiredStates || isLoadingActions || isLoadingActionTrack;

    const trackButtonsRef = useRef<HTMLHRElement | null>(null);
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [selectedObject, setSelectedObject] = useState<Ambition | DesiredState | Action>();
    const [actionTrackColumns, setActionTrackColumns] = useState<1 | 2>(1);

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
                        title='大望：アーカイブ'
                        message={`「${(selectedObject as DesiredState).name}」をアーカイブします。`}
                        actionName='アーカイブする'
                    />
                );
            case 'CreateAction':
                return <ActionDialog onClose={() => setOpenedDialog(undefined)} />;
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
        if ([actionTracksForTheDay, activeActionTracks, dailyAggregation].some(x => x === undefined) && !isLoading) getActionTracksForHome();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksForTheDay, activeActionTracks, getActionTracksForHome]);
    return (
        <BasePage isLoading={isLoading} pageName='Home'>
            <Box sx={{ pt: 4 }}>
                <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                    <Stack justifyContent='end'>
                        <Button
                            variant='outlined'
                            size='medium'
                            onClick={() => {
                                trackButtonsRef.current && window.scrollTo({ top: trackButtonsRef.current.offsetTop - 50, behavior: 'smooth' });
                            }}
                        >
                            今すぐ計測
                        </Button>
                    </Stack>
                </Box>
                <Stack direction='row' justifyContent='space-between'>
                    <Stack direction='row' mt={0.5}>
                        <AmbitionIcon />
                        <Typography variant='h6' textAlign='left'>
                            大望
                        </Typography>
                    </Stack>
                    <Stack direction='row'>
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
                                            onClick={e => {
                                                e.stopPropagation();
                                                setSelectedObject(ambition);
                                                setOpenedDialog('EditAmbition');
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size='small'
                                            onClick={e => {
                                                e.stopPropagation();
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
                            目指す姿
                        </Typography>
                    </Stack>
                    <Stack direction='row'>
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
                                            onClick={e => {
                                                e.stopPropagation();
                                                setSelectedObject(desiredState);
                                                setOpenedDialog('EditDesiredState');
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size='small'
                                            onClick={e => {
                                                e.stopPropagation();
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
                            行動
                        </Typography>
                    </Stack>
                    <Stack direction='row'>
                        <ToggleButtonGroup value={actionTrackColumns} size='small' exclusive onChange={(_, newValue) => setActionTrackColumns(newValue)}>
                            <ToggleButton value={1}>
                                <TableRowsIcon />
                            </ToggleButton>
                            <ToggleButton value={2}>
                                <GridViewSharpIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
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
                {actionTracksForTheDay !== undefined && actionTracksForTheDay.length > 0 && (
                    <Box>
                        <Stack direction='row' justifyContent='space-between'>
                            <Typography>{actionTracksForTheDay[0].date}</Typography>
                            <Button variant='text'>全履歴表示</Button>
                        </Stack>
                        <Grid container spacing={1}>
                            {actionTracksForTheDay.map(actionTrack => {
                                if (actionTrack.endedAt !== undefined) {
                                    return <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />;
                                }
                                return <div key={actionTrack.id} />;
                            })}
                        </Grid>
                    </Box>
                )}
                {activeActionTracks && <ActiveActionTracks activeActionTracks={activeActionTracks} bottom={60} />}
                {openedDialog && getDialog()}
            </Box>
        </BasePage>
    );
};

export default Home;
