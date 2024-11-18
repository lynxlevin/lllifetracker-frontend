import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Paper, IconButton } from '@mui/material';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BasePage from '../../components/BasePage';
import useObjectiveContext from '../../hooks/useObjectiveContext';
import useActionContext from '../../hooks/useActionContext';
// import AppIcon from '../components/AppIcon';

type DialogNames = 'Ambition' | 'Objective' | 'Action' | 'LinkObjectives' | 'LinkActions';

const AmbitionsObjectivesActions = () => {
    const { isLoading: isLoadingAmbitions, ambitionsWithLinks, getAmbitionsWithLinks, deleteAmbition, deleteObjective, deleteAction } = useAmbitionContext();
    const { isLoading: isLoadingObjectives, objectivesWithLinks, getObjectivesWithLinks } = useObjectiveContext();
    const { isLoading: isLoadingActions, actionsWithLinks, getActionsWithLinks } = useActionContext();
    const [openedDialog, setOpenedDialog] = useState<DialogNames>();
    const navigate = useNavigate();
    const isLoading = isLoadingAmbitions || isLoadingObjectives || isLoadingActions;

    const closeAllDialogs = () => {
        setOpenedDialog(undefined);
    };

    // const getDialog = () => {
    //     switch (openedDialog) {
    //         case 'Ambition':
    //             return <AmbitionDialog onClose={closeAllDialogs} ambition={selectedAmbition} />;
    //         case 'Objective':
    //             return <ObjectiveDialog onClose={closeAllDialogs} ambition={selectedAmbition} objective={selectedObjective} />;
    //         case 'Action':
    //             return <ActionDialog onClose={closeAllDialogs} objective={selectedObjective} action={selectedAction} />;
    //         case 'LinkObjectives':
    //             return <LinkObjectivesDialog onClose={closeAllDialogs} ambition={selectedAmbition!} />;
    //         case 'LinkActions':
    //             return <LinkActionsDialog onClose={closeAllDialogs} objective={selectedObjective!} />;
    //     }
    // };

    useEffect(() => {
        if (ambitionsWithLinks === undefined && !isLoadingAmbitions) getAmbitionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitionsWithLinks, getAmbitionsWithLinks]);

    useEffect(() => {
        if (objectivesWithLinks === undefined && !isLoadingObjectives) getObjectivesWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectivesWithLinks, getObjectivesWithLinks]);

    useEffect(() => {
        if (actionsWithLinks === undefined && !isLoadingActions) getActionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionsWithLinks, getActionsWithLinks]);
    return (
        <BasePage isLoading={isLoading}>
            <>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                    }}
                >
                    <IconButton
                        onClick={() => {
                            navigate('/ambitions');
                        }}
                        aria-label='list'
                        color='primary'
                        sx={{ position: 'absolute', top: -24, left: 0, fontSize: 18 }}
                    >
                        <ArrowBackIcon />
                        Ambitions
                    </IconButton>
                    <>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Typography component='h5' variant='h5' sx={{ mb: 2 }}>
                                Ambitions
                            </Typography>
                            <IconButton
                                onClick={() => {
                                    setOpenedDialog('Ambition');
                                }}
                                aria-label='add'
                                color='primary'
                                sx={{ position: 'absolute', top: 18, right: 0 }}
                            >
                                <AddCircleOutlineOutlinedIcon />
                            </IconButton>
                        </div>
                        <Stack spacing={2} sx={{ width: '100%', textAlign: 'left', mb: 2 }}>
                            {ambitionsWithLinks?.map(ambition => {
                                return (
                                    <Paper key={ambition.id} sx={{ padding: 1, position: 'relative', paddingRight: 3 }}>
                                        <Typography variant='h6'>{ambition.name}</Typography>
                                        <Typography sx={{ marginLeft: 1 }}>{ambition.description ?? '　'}</Typography>
                                    </Paper>
                                );
                            })}
                        </Stack>
                    </>
                    <>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Typography component='h5' variant='h5' sx={{ mb: 2 }}>
                                Objectives
                            </Typography>
                            <IconButton
                                onClick={() => {
                                    setOpenedDialog('Ambition');
                                }}
                                aria-label='add'
                                color='primary'
                                sx={{ position: 'absolute', top: 18, right: 0 }}
                            >
                                <AddCircleOutlineOutlinedIcon />
                            </IconButton>
                        </div>
                        <Stack spacing={2} sx={{ width: '100%', textAlign: 'left', mb: 2 }}>
                            {objectivesWithLinks?.map(objective => {
                                return (
                                    <Paper key={objective.id} sx={{ padding: 1, position: 'relative', paddingRight: 3 }}>
                                        <Typography variant='h6'>{objective.name}</Typography>
                                    </Paper>
                                );
                            })}
                        </Stack>
                    </>
                    <>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Typography component='h5' variant='h5' sx={{ mb: 2 }}>
                                Actions
                            </Typography>
                            <IconButton
                                onClick={() => {
                                    setOpenedDialog('Ambition');
                                }}
                                aria-label='add'
                                color='primary'
                                sx={{ position: 'absolute', top: 18, right: 0 }}
                            >
                                <AddCircleOutlineOutlinedIcon />
                            </IconButton>
                        </div>
                        <Stack spacing={2} sx={{ width: '100%', textAlign: 'left' }}>
                            {actionsWithLinks?.map(action => {
                                return (
                                    <Paper key={action.id} sx={{ padding: 1, position: 'relative', paddingRight: 3 }}>
                                        <Typography variant='h6'>{action.name}</Typography>
                                    </Paper>
                                );
                            })}
                        </Stack>
                    </>
                </Box>
                {/* {openedDialog && getDialog()} */}
            </>
        </BasePage>
    );
};

export default AmbitionsObjectivesActions;
