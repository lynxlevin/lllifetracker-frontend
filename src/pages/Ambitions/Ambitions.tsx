import { useContext, useEffect, useState } from 'react';
import { Box, Typography, Container, CssBaseline, Stack, Paper, IconButton } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../contexts/user-context';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import Loading from '../Loading';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AmbitionDialog from './AmbitionDialog';
import type { AmbitionWithLinks } from '../../types/ambition';
import type { ObjectiveWithActions } from '../../types/objective';
import AmbitionMenu from './AmbitionMenu';
import ObjectiveMenu from './ObjectiveMenu';
import ActionMenu from './ActionMenu';
import ObjectiveDialog from './ObjectiveDialog';
import ActionDialog from './ActionDialog';
import type { Action } from '../../types/action';
import LinkObjectivesDialog from './LinkObjectivesDialog';
// import AppIcon from '../components/AppIcon';

type DialogNames = 'Ambition' | 'Objective' | 'Action' | 'LinkObjectives';

const Ambitions = () => {
    const userContext = useContext(UserContext);

    const { isLoading, ambitionsWithLinks, getAmbitionsWithLinks } = useAmbitionContext();
    const [openedDialog, setOpenedDialog] = useState<DialogNames>();
    const [selectedAmbition, setSelectedAmbition] = useState<AmbitionWithLinks>();
    const [selectedObjective, setSelectedObjective] = useState<ObjectiveWithActions>();
    const [selectedAction, setSelectedAction] = useState<Action>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Ambition':
                return (
                    <AmbitionDialog
                        onClose={() => {
                            setSelectedAmbition(undefined);
                            setSelectedObjective(undefined);
                            setSelectedAction(undefined);
                            setOpenedDialog(undefined);
                        }}
                        ambition={selectedAmbition}
                    />
                );
            case 'Objective':
                return (
                    <ObjectiveDialog
                        onClose={() => {
                            setSelectedAmbition(undefined);
                            setSelectedObjective(undefined);
                            setSelectedAction(undefined);
                            setOpenedDialog(undefined);
                        }}
                        ambition={selectedAmbition}
                        objective={selectedObjective}
                    />
                );
            case 'Action':
                return (
                    <ActionDialog
                        onClose={() => {
                            setSelectedAmbition(undefined);
                            setSelectedObjective(undefined);
                            setSelectedAction(undefined);
                            setOpenedDialog(undefined);
                        }}
                        objective={selectedObjective}
                        action={selectedAction}
                    />
                );
            case 'LinkObjectives':
                return (
                    <LinkObjectivesDialog
                        onClose={() => {
                            setSelectedAmbition(undefined);
                            setSelectedObjective(undefined);
                            setSelectedAction(undefined);
                            setOpenedDialog(undefined);
                        }}
                        ambition={selectedAmbition!}
                    />
                );
        }
    };

    useEffect(() => {
        if (ambitionsWithLinks === undefined && !isLoading) getAmbitionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitionsWithLinks, getAmbitionsWithLinks]);

    if (userContext.isLoggedIn === false) {
        return <Navigate to='/login' />;
    }
    if (isLoading) {
        return <Loading />;
    }
    return (
        <Container component='main' maxWidth='xs' sx={{ paddingBottom: 2 }}>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {/* <AppIcon height={36} /> */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <Typography component='h1' variant='h4' sx={{ mt: 2 }}>
                        Ambitions
                    </Typography>
                    <IconButton
                        onClick={() => {
                            setSelectedAmbition(undefined);
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
                    {ambitionsWithLinks?.map(ambition => {
                        return (
                            <Paper key={ambition.id} sx={{ padding: 1, position: 'relative' }}>
                                <Typography variant='h6'>{ambition.name}</Typography>
                                <Typography sx={{ marginLeft: 1 }}>{ambition.description ?? '　'}</Typography>
                                <AmbitionMenu
                                    handleEditAmbition={() => {
                                        setSelectedAmbition(ambition);
                                        setOpenedDialog('Ambition');
                                    }}
                                    handleAddObjective={() => {
                                        setSelectedAmbition(ambition);
                                        setOpenedDialog('Objective');
                                    }}
                                    handleLinkObjectives={() => {
                                        setSelectedAmbition(ambition);
                                        setOpenedDialog('LinkObjectives');
                                    }}
                                />
                                <Stack spacing={2} sx={{ marginLeft: 3, marginTop: 2 }}>
                                    {ambition.objectives.map(objective => {
                                        return (
                                            <Paper key={`${ambition.id}-${objective.id}`} sx={{ padding: 1, position: 'relative' }}>
                                                <Typography>{objective.name}</Typography>
                                                <ObjectiveMenu
                                                    handleEditObjective={() => {
                                                        setSelectedObjective(objective);
                                                        setOpenedDialog('Objective');
                                                    }}
                                                    handleAddAction={() => {
                                                        setSelectedObjective(objective);
                                                        setOpenedDialog('Action');
                                                    }}
                                                />
                                                <Stack spacing={2} sx={{ marginLeft: 3, marginTop: 2 }}>
                                                    {objective.actions.map(action => {
                                                        return (
                                                            <Paper
                                                                key={`${ambition.id}-${objective.id}-${action.id}`}
                                                                sx={{ padding: 1, position: 'relative' }}
                                                            >
                                                                <Typography>{action.name}</Typography>
                                                                <ActionMenu
                                                                    handleEditAction={() => {
                                                                        setSelectedAction(action);
                                                                        setOpenedDialog('Action');
                                                                    }}
                                                                />
                                                            </Paper>
                                                        );
                                                    })}
                                                </Stack>
                                            </Paper>
                                        );
                                    })}
                                </Stack>
                            </Paper>
                        );
                    })}
                </Stack>
            </Box>
            {openedDialog && getDialog()}
        </Container>
    );
};

export default Ambitions;
