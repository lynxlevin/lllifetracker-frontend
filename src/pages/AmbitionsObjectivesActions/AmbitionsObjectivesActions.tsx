import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Paper, IconButton, Accordion, AccordionDetails, Container, AccordionSummary } from '@mui/material';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BasePage from '../../components/BasePage';
import useObjectiveContext from '../../hooks/useObjectiveContext';
import useActionContext from '../../hooks/useActionContext';
// import AppIcon from '../components/AppIcon';

type DialogNames = 'Ambition' | 'Objective' | 'Action' | 'LinkObjectives' | 'LinkActions';

const AmbitionsObjectivesActions = () => {
    const { isLoading: isLoadingAmbitions, ambitionsWithLinks, getAmbitionsWithLinks, deleteAmbition } = useAmbitionContext();
    const { isLoading: isLoadingObjectives, objectivesWithLinks, getObjectivesWithLinks } = useObjectiveContext();
    const { isLoading: isLoadingActions, actionsWithLinks, getActionsWithLinks } = useActionContext();
    const [openedDialog, setOpenedDialog] = useState<DialogNames>();
    const [accordionId, setAccordionId] = useState<string | null>(null);
    const navigate = useNavigate();
    const isLoading = isLoadingAmbitions || isLoadingObjectives || isLoadingActions;

    const handleAccordion = (id: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setAccordionId(newExpanded ? id : null);
    };

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
                        <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mb: 2 }}>
                            {ambitionsWithLinks?.map(ambition => {
                                return (
                                    <Accordion key={ambition.id} expanded={accordionId === ambition.id} onChange={handleAccordion(ambition.id)}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Container>
                                                <Typography variant='h6'>{ambition.name}</Typography>
                                                <Typography sx={{ marginLeft: 1 }}>{ambition.description ?? '　'}</Typography>
                                            </Container>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack spacing={1} sx={{ ml: 3 }}>
                                                {ambition.objectives.map(objective => {
                                                    return (
                                                        <Paper key={`${ambition.id}-${objective.id}`} sx={{ padding: 1 }}>
                                                            <Typography>{objective.name}</Typography>
                                                            <Stack spacing={1} sx={{ ml: 3 }}>
                                                                {objective.actions.map(action => {
                                                                    return (
                                                                        <Paper key={`${ambition.id}-${objective.id}-${action.id}`} sx={{ padding: 1 }}>
                                                                            <Typography>{action.name}</Typography>
                                                                        </Paper>
                                                                    );
                                                                })}
                                                            </Stack>
                                                        </Paper>
                                                    );
                                                })}
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
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
                                    setOpenedDialog('Objective');
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
                                    <Accordion key={objective.id} expanded={accordionId === objective.id} onChange={handleAccordion(objective.id)}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Container>
                                                <Typography variant='h6'>{objective.name}</Typography>
                                            </Container>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack spacing={1} sx={{ ml: 3 }}>
                                                {objective.ambitions.map(ambition => {
                                                    return (
                                                        <Paper key={`${objective.id}-${ambition.id}`} sx={{ padding: 1 }}>
                                                            <Typography>{ambition.name}</Typography>
                                                        </Paper>
                                                    );
                                                })}
                                            </Stack>
                                            <Stack spacing={1} sx={{ ml: 3 }}>
                                                {objective.actions.map(action => {
                                                    return (
                                                        <Paper key={`${objective.id}-${action.id}`} sx={{ padding: 1 }}>
                                                            <Typography>{action.name}</Typography>
                                                        </Paper>
                                                    );
                                                })}
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
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
                                    setOpenedDialog('Action');
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
                                    <Accordion key={action.id} expanded={accordionId === action.id} onChange={handleAccordion(action.id)}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Container>
                                                <Typography variant='h6'>{action.name}</Typography>
                                            </Container>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Stack spacing={1} sx={{ ml: 3 }}>
                                                {action.objectives.map(objective => {
                                                    return (
                                                        <Paper key={`${action.id}-${objective.id}`} sx={{ padding: 1 }}>
                                                            <Typography>{objective.name}</Typography>
                                                            <Stack spacing={1} sx={{ ml: 3 }}>
                                                                {objective.ambitions.map(ambition => {
                                                                    return (
                                                                        <Paper key={`${action.id}-${objective.id}-${ambition.id}`} sx={{ padding: 1 }}>
                                                                            <Typography>{ambition.name}</Typography>
                                                                        </Paper>
                                                                    );
                                                                })}
                                                            </Stack>
                                                        </Paper>
                                                    );
                                                })}
                                            </Stack>
                                        </AccordionDetails>
                                    </Accordion>
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
