import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Paper, IconButton } from '@mui/material';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AmbitionDialog from './Dialogs/AmbitionDialog';
import type { AmbitionWithLinks } from '../../types/ambition';
import type { ObjectiveWithActions } from '../../types/objective';
import AmbitionMenu from './Menus/AmbitionMenu';
import ObjectiveMenu from './Menus/ObjectiveMenu';
import ActionMenu from './Menus/ActionMenu';
import ObjectiveDialog from './Dialogs/ObjectiveDialog';
import ActionDialog from './Dialogs/ActionDialog';
import type { Action } from '../../types/action';
import LinkActionsDialog from './Dialogs/LinkActionsDialog';
import BasePage from '../../components/BasePage';
import { ActionTypography, AmbitionTypography, ObjectiveTypography } from '../../components/CustomTypography';
import useObjectiveContext from '../../hooks/useObjectiveContext';
import useActionContext from '../../hooks/useActionContext';
import useUserAPI from '../../hooks/useUserAPI';
// import AppIcon from '../components/AppIcon';

type DialogType = 'Ambition' | 'Objective' | 'Action' | 'LinkActions';

const Ambitions = () => {
    const { isLoggedIn } = useUserAPI();
    const { isLoading, ambitionsWithLinks, getAmbitionsWithLinks, deleteObjective, deleteAction } = useAmbitionContext();
    const { isLoading: isLoadingObjectives, objectivesWithLinks, getObjectivesWithLinks } = useObjectiveContext();
    const { isLoading: isLoadingActions, actionsWithLinks, getActionsWithLinks } = useActionContext();
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [selectedAmbition, setSelectedAmbition] = useState<AmbitionWithLinks>();
    const [selectedObjective, setSelectedObjective] = useState<ObjectiveWithActions>();
    const [selectedAction, setSelectedAction] = useState<Action>();
    const navigate = useNavigate();

    const closeAllDialogs = () => {
        setSelectedAmbition(undefined);
        setSelectedObjective(undefined);
        setSelectedAction(undefined);
        setOpenedDialog(undefined);
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Ambition':
                return <AmbitionDialog onClose={closeAllDialogs} ambition={selectedAmbition} />;
            case 'Objective':
                return <ObjectiveDialog onClose={closeAllDialogs} ambition={selectedAmbition} objective={selectedObjective} />;
            case 'Action':
                return <ActionDialog onClose={closeAllDialogs} objective={selectedObjective} action={selectedAction} />;
            case 'LinkActions':
                return <LinkActionsDialog onClose={closeAllDialogs} objective={selectedObjective!} />;
        }
    };

    useEffect(() => {
        if (ambitionsWithLinks === undefined && !isLoading && isLoggedIn) getAmbitionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitionsWithLinks, getAmbitionsWithLinks]);

    useEffect(() => {
        if (objectivesWithLinks === undefined && !isLoadingObjectives && isLoggedIn) getObjectivesWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectivesWithLinks, getObjectivesWithLinks]);

    useEffect(() => {
        if (actionsWithLinks === undefined && !isLoadingActions && isLoggedIn) getActionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionsWithLinks, getActionsWithLinks]);

    return (
        <BasePage isLoading={isLoading} pageName='Ambitions'>
            <>
                <Box sx={{ position: 'relative', pt: 0.5 }}>
                    <IconButton
                        onClick={() => {
                            navigate('/objectives');
                        }}
                        aria-label='objectives'
                        color='primary'
                        sx={{ position: 'absolute', top: -20, right: 0, fontSize: 18, zIndex: 100 }}
                    >
                        Objectives
                        <ArrowForwardIcon />
                    </IconButton>
                    <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                        <Typography variant='h5'>大望</Typography>
                        <IconButton
                            onClick={() => {
                                setSelectedAmbition(undefined);
                                setOpenedDialog('Ambition');
                            }}
                            aria-label='add'
                            color='primary'
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                        >
                            <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                    </Box>
                    <Stack spacing={2} sx={{ width: '100%', textAlign: 'left', pt: 2, pb: 5 }}>
                        {ambitionsWithLinks?.map(ambition => {
                            return (
                                <Paper key={ambition.id} sx={{ padding: 1, position: 'relative' }}>
                                    <AmbitionTypography name={ambition.name} description={ambition.description} variant='h6' />
                                    <AmbitionMenu ambition={ambition} />
                                    <Stack spacing={2} sx={{ mt: 1 }}>
                                        {ambition.objectives.map(objective => {
                                            return (
                                                <Paper key={`${ambition.id}-${objective.id}`} sx={{ padding: 1, position: 'relative', paddingRight: 3 }}>
                                                    <ObjectiveTypography name={objective.name} description={objective.description} />
                                                    <ObjectiveMenu
                                                        handleEditObjective={() => {
                                                            setSelectedObjective(objective);
                                                            setOpenedDialog('Objective');
                                                        }}
                                                        handleDeleteObjective={() => {
                                                            deleteObjective(objective.id);
                                                        }}
                                                        handleAddAction={() => {
                                                            setSelectedObjective(objective);
                                                            setOpenedDialog('Action');
                                                        }}
                                                        handleLinkActions={() => {
                                                            setSelectedObjective(objective);
                                                            setOpenedDialog('LinkActions');
                                                        }}
                                                    />
                                                    <Stack spacing={2} sx={{ mt: 1 }}>
                                                        {objective.actions.map(action => {
                                                            return (
                                                                <Paper
                                                                    key={`${ambition.id}-${objective.id}-${action.id}`}
                                                                    sx={{ padding: 1, position: 'relative', paddingRight: 3 }}
                                                                >
                                                                    <ActionTypography name={action.name} description={action.description} />
                                                                    <ActionMenu
                                                                        handleEditAction={() => {
                                                                            setSelectedAction(action);
                                                                            setOpenedDialog('Action');
                                                                        }}
                                                                        handleDeleteAction={() => {
                                                                            deleteAction(action.id);
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
            </>
        </BasePage>
    );
};

export default Ambitions;
