import { useContext, useEffect, useState } from 'react';
import { Box, Typography, Container, CssBaseline, Stack, Paper, IconButton } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../contexts/user-context';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import Loading from '../Loading';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CreateAmbitionDialog from './CreateAmbitionDialog';
import AddObjectiveDialog from './AddObjectiveDialog';
import type { AmbitionWithLinks } from '../../types/ambition';
import type { ObjectiveWithActions } from '../../types/objective';
import AddActionDialog from './AddActionDialog';
// import AppIcon from '../components/AppIcon';

const Ambitions = () => {
    const userContext = useContext(UserContext);

    const { isLoading, ambitionsWithLinks, getAmbitionsWithLinks } = useAmbitionContext();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedAmbition, setSelectedAmbition] = useState<AmbitionWithLinks>();
    const [selectedObjective, setSelectedObjective] = useState<ObjectiveWithActions>();

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
                            setIsCreateDialogOpen(true);
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
                                <IconButton
                                    onClick={() => {
                                        setSelectedAmbition(ambition);
                                    }}
                                    aria-label='add'
                                    color='primary'
                                    sx={{ position: 'absolute', top: 32, right: 0 }}
                                >
                                    <AddCircleOutlineOutlinedIcon />
                                </IconButton>
                                <Stack spacing={2} sx={{ marginLeft: 3, marginTop: 2 }}>
                                    {ambition.objectives.map(objective => {
                                        return (
                                            <Paper key={`${ambition.id}-${objective.id}`} sx={{ padding: 1, position: 'relative' }}>
                                                <Typography>{objective.name}</Typography>
                                                <IconButton
                                                    onClick={() => {
                                                        setSelectedObjective(objective);
                                                    }}
                                                    aria-label='add'
                                                    color='primary'
                                                    sx={{ position: 'absolute', top: 0, right: 0 }}
                                                >
                                                    <AddCircleOutlineOutlinedIcon />
                                                </IconButton>
                                                <Stack spacing={2} sx={{ marginLeft: 3, marginTop: 2 }}>
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
                            </Paper>
                        );
                    })}
                </Stack>
            </Box>
            {isCreateDialogOpen && (
                <CreateAmbitionDialog
                    onClose={() => {
                        setIsCreateDialogOpen(false);
                    }}
                />
            )}
            {selectedAmbition !== undefined && (
                <AddObjectiveDialog
                    onClose={() => {
                        setSelectedAmbition(undefined);
                    }}
                    ambition={selectedAmbition}
                />
            )}
            {selectedObjective !== undefined && (
                <AddActionDialog
                    onClose={() => {
                        setSelectedObjective(undefined);
                    }}
                    objective={selectedObjective}
                />
            )}
        </Container>
    );
};

export default Ambitions;
