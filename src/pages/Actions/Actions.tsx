import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { ActionTypography, ObjectiveTypography } from '../../components/CustomTypography';
import useUserAPI from '../../hooks/useUserAPI';
import ActionDialog from './Dialogs/ActionDialog';
import ActionMenu from './Menus/ActionMenu';
// import AppIcon from '../components/AppIcon';

const Actions = () => {
    const { isLoggedIn } = useUserAPI();
    const { isLoading, actionsWithLinks, getActionsWithLinks } = useActionContext();
    const navigate = useNavigate();

    const [isCreateActionDialogOpen, setIsCreateActionDialogOpen] = useState(false);

    useEffect(() => {
        if (actionsWithLinks === undefined && !isLoading && isLoggedIn) getActionsWithLinks();
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
                        sx={{ position: 'absolute', top: -20, left: 0, fontSize: 18, zIndex: 100 }}
                    >
                        <ArrowBackIcon />
                        Objectives
                    </IconButton>
                    <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                        <Typography variant='h5'>行動</Typography>
                        <IconButton
                            onClick={() => {
                                setIsCreateActionDialogOpen(true);
                            }}
                            aria-label='add'
                            color='primary'
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                        >
                            <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                    </Box>
                    <Stack spacing={2} sx={{ width: '100%', textAlign: 'left', pt: 2, pb: 5 }}>
                        {actionsWithLinks?.map(action => {
                            return (
                                <Paper key={action.id} sx={{ p: 1, position: 'relative' }}>
                                    <ActionTypography name={action.name} description={action.description} variant='h6' />
                                    <ActionMenu action={action} />
                                    <Stack spacing={1} sx={{ mt: 1 }}>
                                        {action.objectives.map(objective => {
                                            return (
                                                <Paper key={`${action.id}-${objective.id}`} sx={{ padding: 1 }}>
                                                    <ObjectiveTypography name={objective.name} description={objective.description} />
                                                </Paper>
                                            );
                                        })}
                                    </Stack>
                                </Paper>
                            );
                        })}
                    </Stack>
                </Box>
                {isCreateActionDialogOpen && <ActionDialog onClose={() => setIsCreateActionDialogOpen(false)} />}
            </>
        </BasePage>
    );
};

export default Actions;
