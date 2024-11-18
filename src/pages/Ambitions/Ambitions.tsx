import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Paper, IconButton } from '@mui/material';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AmbitionDialog from './Dialogs/AmbitionDialog';
import type { AmbitionWithLinks } from '../../types/ambition';
import type { ObjectiveWithActions } from '../../types/objective';
import AmbitionMenu from './Menus/AmbitionMenu';
import ObjectiveMenu from './Menus/ObjectiveMenu';
import ActionMenu from './Menus/ActionMenu';
import ObjectiveDialog from './Dialogs/ObjectiveDialog';
import ActionDialog from './Dialogs/ActionDialog';
import type { Action } from '../../types/action';
import LinkObjectivesDialog from './Dialogs/LinkObjectivesDialog';
import LinkActionsDialog from './Dialogs/LinkActionsDialog';
import BasePage from '../../components/BasePage';
// import AppIcon from '../components/AppIcon';

type DialogNames = 'Ambition' | 'Objective' | 'Action' | 'LinkObjectives' | 'LinkActions';

const Ambitions = () => {
    const { isLoading, ambitionsWithLinks, getAmbitionsWithLinks, deleteAmbition, deleteObjective } = useAmbitionContext();
    const [openedDialog, setOpenedDialog] = useState<DialogNames>();
    const [selectedAmbition, setSelectedAmbition] = useState<AmbitionWithLinks>();
    const [selectedObjective, setSelectedObjective] = useState<ObjectiveWithActions>();
    const [selectedAction, setSelectedAction] = useState<Action>();

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
            case 'LinkObjectives':
                return <LinkObjectivesDialog onClose={closeAllDialogs} ambition={selectedAmbition!} />;
            case 'LinkActions':
                return <LinkActionsDialog onClose={closeAllDialogs} objective={selectedObjective!} />;
        }
    };

    useEffect(() => {
        if (ambitionsWithLinks === undefined && !isLoading) getAmbitionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitionsWithLinks, getAmbitionsWithLinks]);

    return (
        <BasePage isLoading={isLoading}>
            {/* MYMEMO: Ambition/Objectives/Actions をまとめて列挙したページを作る。アコーディオン開くとリンクが表示される。 */}
            <>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* <AppIcon height={36} /> */}
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Typography component='h1' variant='h4' sx={{ mb: 2 }}>
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
                                <Paper key={ambition.id} sx={{ padding: 1, position: 'relative', paddingRight: 3 }}>
                                    <Typography variant='h6'>{ambition.name}</Typography>
                                    <Typography sx={{ marginLeft: 1 }}>{ambition.description ?? '　'}</Typography>
                                    <AmbitionMenu
                                        handleEditAmbition={() => {
                                            setSelectedAmbition(ambition);
                                            setOpenedDialog('Ambition');
                                        }}
                                        handleDeleteAmbition={() => {
                                            deleteAmbition(ambition.id);
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
                                                <Paper key={`${ambition.id}-${objective.id}`} sx={{ padding: 1, position: 'relative', paddingRight: 3 }}>
                                                    <Typography>{objective.name}</Typography>
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
                                                    <Stack spacing={2} sx={{ marginLeft: 3, marginTop: 2 }}>
                                                        {objective.actions.map(action => {
                                                            return (
                                                                <Paper
                                                                    key={`${ambition.id}-${objective.id}-${action.id}`}
                                                                    sx={{ padding: 1, position: 'relative', paddingRight: 3 }}
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
            </>
        </BasePage>
    );
};

export default Ambitions;
