import { useContext, useEffect, useState } from 'react';
import { Box, Typography, Container, CssBaseline, Stack, Paper, IconButton, Menu } from '@mui/material';
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

const Ambitions = () => {
    const userContext = useContext(UserContext);

    const { isLoading, ambitionsWithLinks, getAmbitionsWithLinks } = useAmbitionContext();

    const [isAmbitionDialogOpen, setIsAmbitionDialogOpen] = useState(false);
    const [isObjectiveDialogOpen, setIsObjectiveDialogOpen] = useState(false);
    const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
    const [isLinkObjectivesDialogOpen, setIsLinkObjectivesDialogOpen] = useState(false);
    const [selectedAmbition, setSelectedAmbition] = useState<AmbitionWithLinks>();
    const [selectedObjective, setSelectedObjective] = useState<ObjectiveWithActions>();
    const [selectedAction, setSelectedAction] = useState<Action>();

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
                            setIsAmbitionDialogOpen(true);
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
                                        setIsAmbitionDialogOpen(true);
                                        setIsLinkObjectivesDialogOpen(false);
                                    }}
                                    handleAddObjective={() => {
                                        setSelectedAmbition(ambition);
                                        setSelectedObjective(undefined);
                                        setIsObjectiveDialogOpen(true);
                                    }}
                                    handleLinkObjectives={() => {
                                        setSelectedAmbition(ambition);
                                        setIsAmbitionDialogOpen(false);
                                        setIsLinkObjectivesDialogOpen(true);
                                    }}
                                />
                                <Stack spacing={2} sx={{ marginLeft: 3, marginTop: 2 }}>
                                    {ambition.objectives.map(objective => {
                                        return (
                                            <Paper key={`${ambition.id}-${objective.id}`} sx={{ padding: 1, position: 'relative' }}>
                                                <Typography>{objective.name}</Typography>
                                                <ObjectiveMenu
                                                    handleEditObjective={() => {
                                                        setSelectedAmbition(undefined);
                                                        setSelectedObjective(objective);
                                                        setIsObjectiveDialogOpen(true);
                                                    }}
                                                    handleAddAction={() => {
                                                        setSelectedObjective(objective);
                                                        setSelectedAction(undefined);
                                                        setIsActionDialogOpen(true);
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
                                                                        setSelectedObjective(undefined);
                                                                        setSelectedAction(action);
                                                                        setIsActionDialogOpen(true);
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
            {isAmbitionDialogOpen && (
                <AmbitionDialog
                    onClose={() => {
                        setSelectedAmbition(undefined);
                        setIsAmbitionDialogOpen(false);
                        setIsLinkObjectivesDialogOpen(false);
                    }}
                    ambition={selectedAmbition}
                />
            )}
            {/* MYMEMO: この辺の開閉の動作はテストかきたい。変なバグの元になるので */}
            {isObjectiveDialogOpen && false && (
                <ObjectiveDialog
                    onClose={() => {
                        setSelectedAmbition(undefined);
                        setSelectedObjective(undefined);
                        setIsObjectiveDialogOpen(false);
                    }}
                    ambition={selectedAmbition}
                    objective={selectedObjective}
                />
            )}
            {isActionDialogOpen && (
                <ActionDialog
                    onClose={() => {
                        setSelectedObjective(undefined);
                        setSelectedAction(undefined);
                        setIsActionDialogOpen(false);
                    }}
                    objective={selectedObjective}
                    action={selectedAction}
                />
            )}
            {isLinkObjectivesDialogOpen && selectedAmbition !== undefined && (
                <LinkObjectivesDialog
                    onClose={() => {
                        setSelectedAmbition(undefined);
                        setIsAmbitionDialogOpen(false);
                        setIsLinkObjectivesDialogOpen(false);
                    }}
                    ambition={selectedAmbition}
                />
            )}
        </Container>
    );
};

export default Ambitions;