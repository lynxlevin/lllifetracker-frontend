import { AppBar, Box, Dialog, DialogContent, IconButton, Paper, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import CloseIcon from '@mui/icons-material/Close';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import { ActionIcon } from '../../../../components/CustomIcons';
import type { Action } from '../../../../types/action';
import useActionContext from '../../../../hooks/useActionContext';
import { format } from 'date-fns';
import { ActionAPI } from '../../../../apis/ActionAPI';

interface ArchivedActionsDialogProps {
    onClose: () => void;
}
type DialogType = 'Unarchive' | 'Delete';

const ArchivedActionsDialog = ({ onClose }: ArchivedActionsDialogProps) => {
    const [actions, setActions] = useState<Action[]>();
    const [selectedAction, setSelectedAction] = useState<Action>();
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { unarchiveAction, deleteAction } = useActionContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Unarchive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedAction(undefined);
                        }}
                        handleSubmit={() => {
                            unarchiveAction(selectedAction!.id);
                            setSelectedAction(undefined);
                            setOpenedDialog(undefined);
                            const selectedActionIndex = actions!.indexOf(selectedAction!);
                            setActions(prev => [...prev!.slice(0, selectedActionIndex), ...prev!.slice(selectedActionIndex + 1)]);
                        }}
                        title='行動：アンアーカイブ'
                        message={`「${selectedAction!.name}」をアンアーカイブします。`}
                        actionName='アンアーカイブする'
                    />
                );
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedAction(undefined);
                        }}
                        handleSubmit={() => {
                            deleteAction(selectedAction!.id);
                            setSelectedAction(undefined);
                            setOpenedDialog(undefined);
                            const selectedActionIndex = actions!.indexOf(selectedAction!);
                            setActions(prev => [...prev!.slice(0, selectedActionIndex), ...prev!.slice(selectedActionIndex + 1)]);
                        }}
                        title='行動：削除'
                        message={`「${selectedAction!.name}」を完全に削除します。`}
                        actionName='削除する'
                    />
                );
        }
    };

    useEffect(() => {
        if (actions === undefined) ActionAPI.list(true).then(res => setActions(res.data));
    }, [actions]);

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ backgroundColor: 'background.default' }}>
                <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant='dense'>
                        <div style={{ flexGrow: 1 }} />
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box sx={{ pt: 5 }}>
                    <Stack direction='row'>
                        <ActionIcon />
                        <Typography variant='h6' textAlign='left'>
                            行動：アーカイブリスト
                        </Typography>
                    </Stack>
                    <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                        {actions?.map(action => {
                            return (
                                <Paper key={action.id} sx={{ py: 1, px: 2 }}>
                                    <Stack direction='row' justifyContent='space-between'>
                                        <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                                            {action.name}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                size='small'
                                                onClick={() => {
                                                    setSelectedAction(action);
                                                    setOpenedDialog('Unarchive');
                                                }}
                                            >
                                                <UnarchiveIcon />
                                            </IconButton>
                                            <IconButton
                                                size='small'
                                                onClick={() => {
                                                    setSelectedAction(action);
                                                    setOpenedDialog('Delete');
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Stack>
                                    <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                        {action.description}
                                    </Typography>
                                    <Typography variant='body2' fontWeight={100} pt={2} textAlign='right'>
                                        アーカイブした日:{format(new Date(action.updated_at), 'yyyy-MM-dd')}
                                    </Typography>
                                </Paper>
                            );
                        })}
                    </Stack>
                    {openedDialog && getDialog()}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ArchivedActionsDialog;
