import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Paper, IconButton } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import BasePage from '../../components/BasePage';
import useObjectiveContext from '../../hooks/useObjectiveContext';
import { ActionTypography, ObjectiveTypography } from '../../components/CustomTypography';
import useUserAPI from '../../hooks/useUserAPI';
import ObjectiveDialog from './Dialogs/ObjectiveDialog';
import ObjectiveMenu from './Menus/ObjectiveMenu';
// import AppIcon from '../components/AppIcon';

const Objectives = () => {
    const { isLoggedIn } = useUserAPI();
    const { isLoading, objectivesWithLinks, getObjectivesWithLinks } = useObjectiveContext();

    const [isCreateObjectiveDialogOpen, setIsCreateObjectiveDialogOpen] = useState(false);

    useEffect(() => {
        if (objectivesWithLinks === undefined && !isLoading && isLoggedIn) getObjectivesWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectivesWithLinks, getObjectivesWithLinks]);
    return (
        <BasePage isLoading={isLoading} pageName='Ambitions'>
            <>
                <Box sx={{ pt: 0.5 }}>
                    <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                        <Typography variant='h5'>目標</Typography>
                        <IconButton
                            onClick={() => {
                                setIsCreateObjectiveDialogOpen(true);
                            }}
                            aria-label='add'
                            color='primary'
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                        >
                            <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                    </Box>
                    <Stack spacing={2} sx={{ width: '100%', textAlign: 'left', pt: 2, pb: 5 }}>
                        {objectivesWithLinks?.map(objective => {
                            return (
                                <Paper key={objective.id} sx={{ p: 1, position: 'relative' }}>
                                    <ObjectiveTypography name={objective.name} description={objective.description} variant='h6' />
                                    <ObjectiveMenu objective={objective} />
                                    <Stack spacing={1} sx={{ mt: 1 }}>
                                        {objective.actions.map(action => {
                                            return (
                                                <Paper key={`${objective.id}-${action.id}`} sx={{ padding: 1 }}>
                                                    <ActionTypography name={action.name} />
                                                </Paper>
                                            );
                                        })}
                                    </Stack>
                                </Paper>
                            );
                        })}
                    </Stack>
                </Box>
                {isCreateObjectiveDialogOpen && <ObjectiveDialog onClose={() => setIsCreateObjectiveDialogOpen(false)} />}
            </>
        </BasePage>
    );
};

export default Objectives;
