import styled from '@emotion/styled';
import { Accordion, AccordionDetails, AccordionSummary, Grid2 as Grid, Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import BasePage from '../components/BasePage';
import useActionTrackContext from '../hooks/useActionTrackContext';
import ActionTrackButtons from './ActionTracks/ActionTrackButtons';
import useActionContext from '../hooks/useActionContext';
import ActiveActionTracks from './ActionTracks/ActiveActionTracks';
import { AmbitionTypography, DesiredStateTypography } from '../components/CustomTypography';
import useAmbitionContext from '../hooks/useAmbitionContext';
import useDesiredStateContext from '../hooks/useDesiredStateContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AmbitionDialog from './MyWay/Ambitions/Dialogs/AmbitionDialog';
import DesiredStateDialog from './MyWay/DesiredStates/Dialogs/DesiredStateDialog';
import type { Ambition } from '../types/ambition';
import type { DesiredState } from '../types/desired_state';
import type { Action } from '../types/action';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ActionTrack from './ActionTracks/ActionTrack';

type DialogType = 'CreateAmbition' | 'EditAmbition' | 'ArchiveAmbition' | 'CreateDesiredState' | 'EditDesiredState' | 'ArchiveDesiredState';

const Home = () => {
    const { isLoading: isLoadingAmbitions, getAmbitions, ambitions, archiveAmbition } = useAmbitionContext();
    const { isLoading: isLoadingDesiredStates, getDesiredStates, desiredStates, archiveDesiredState } = useDesiredStateContext();
    const { isLoading: isLoadingActions, getActions, actions } = useActionContext();
    const { isLoading: isLoadingActionTrack, getActionTracksForHome, actionTracksForTheDay, activeActionTracks, dailyAggregation } = useActionTrackContext();
    const isLoading = isLoadingAmbitions || isLoadingDesiredStates || isLoadingActions || isLoadingActionTrack;

    const trackButtonsRef = useRef<HTMLHRElement | null>(null);
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [selectedObject, setSelectedObject] = useState<Ambition | DesiredState | Action>();

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
                    <Typography variant='h6' textAlign='left'>
                        大望
                    </Typography>
                    <Stack direction='row'>
                        <IconButton onClick={() => setOpenedDialog('CreateAmbition')} aria-label='add' color='primary'>
                            <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                    </Stack>
                </Stack>
                <Stack spacing={1} sx={{ textAlign: 'left' }}>
                    {ambitions?.map(ambition => {
                        return (
                            <Accordion key={ambition.id}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <AmbitionTypography name={ambition.name} variant='body1' />
                                </AccordionSummary>
                                <AccordionDetails>
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
                                    <Typography variant='body2' whiteSpace='pre-wrap'>
                                        {ambition.description}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Stack>
                <Divider color='#ccc' sx={{ my: 1 }} />
                <Stack direction='row' justifyContent='space-between'>
                    <Typography variant='h6' textAlign='left'>
                        目指す姿
                    </Typography>
                    <Stack direction='row'>
                        <IconButton onClick={() => setOpenedDialog('CreateDesiredState')} aria-label='add' color='primary'>
                            <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                    </Stack>
                </Stack>
                <Stack spacing={1} sx={{ textAlign: 'left' }}>
                    {desiredStates?.map(desiredState => {
                        return (
                            <Accordion key={desiredState.id}>
                                <AccordionSummary expandIcon={desiredState.description && <ExpandMoreIcon />}>
                                    <DesiredStateTypography name={desiredState.name} variant='body1' />
                                </AccordionSummary>
                                <AccordionDetails>
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
                                    <Typography variant='body2' whiteSpace='pre-wrap'>
                                        {desiredState.description}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Stack>
                <Divider color='#ccc' sx={{ my: 1 }} ref={trackButtonsRef} />
                {actions && <ActionTrackButtons actions={actions} />}
                {actionTracksForTheDay && (
                    <StyledBox>
                        <Typography>{actionTracksForTheDay[0].date}</Typography>
                        <Grid container spacing={1}>
                            {actionTracksForTheDay.map(actionTrack => {
                                if (actionTrack.endedAt !== undefined) {
                                    return <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />;
                                }
                                return <div key={actionTrack.id} />;
                            })}
                        </Grid>
                    </StyledBox>
                )}
                {activeActionTracks && <ActiveActionTracks activeActionTracks={activeActionTracks} bottom={60} />}
                {openedDialog && getDialog()}
            </Box>
        </BasePage>
    );
};

const StyledBox = styled(Box)`
    text-align: left;
    padding-bottom: 8px;
`;

export default Home;
