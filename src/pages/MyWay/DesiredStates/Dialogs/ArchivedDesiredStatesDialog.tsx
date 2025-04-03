import { AppBar, Box, Dialog, DialogContent, IconButton, Paper, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import CloseIcon from '@mui/icons-material/Close';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import { DesiredStateIcon } from '../../../../components/CustomIcons';
import type { DesiredState } from '../../../../types/desired_state';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import { DesiredStateAPI } from '../../../../apis/DesiredStateAPI';

interface ArchivedDesiredStatesDialogProps {
    onClose: () => void;
}
type DialogType = 'Unarchive' | 'Delete';

const ArchivedDesiredStatesDialog = ({ onClose }: ArchivedDesiredStatesDialogProps) => {
    const [desiredStates, setDesiredStates] = useState<DesiredState[]>();
    const [selectedDesiredState, setSelectedDesiredState] = useState<DesiredState>();
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { unarchiveDesiredState, deleteDesiredState } = useDesiredStateContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Unarchive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedDesiredState(undefined);
                        }}
                        handleSubmit={() => {
                            unarchiveDesiredState(selectedDesiredState!.id);
                            setSelectedDesiredState(undefined);
                            setOpenedDialog(undefined);
                            const selectedDesiredStateIndex = desiredStates!.indexOf(selectedDesiredState!);
                            setDesiredStates(prev => [...prev!.slice(0, selectedDesiredStateIndex), ...prev!.slice(selectedDesiredStateIndex + 1)]);
                        }}
                        title='目指す姿：アンアーカイブ'
                        message={`「${selectedDesiredState!.name}」をアンアーカイブします。`}
                        actionName='アンアーカイブする'
                    />
                );
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedDesiredState(undefined);
                        }}
                        handleSubmit={() => {
                            deleteDesiredState(selectedDesiredState!.id);
                            setSelectedDesiredState(undefined);
                            setOpenedDialog(undefined);
                            const selectedDesiredStateIndex = desiredStates!.indexOf(selectedDesiredState!);
                            setDesiredStates(prev => [...prev!.slice(0, selectedDesiredStateIndex), ...prev!.slice(selectedDesiredStateIndex + 1)]);
                        }}
                        title='目指す姿：削除'
                        message={`「${selectedDesiredState!.name}」を完全に削除します。`}
                        actionName='削除する'
                    />
                );
        }
    };

    useEffect(() => {
        if (desiredStates === undefined) DesiredStateAPI.list(true).then(res => setDesiredStates(res.data));
    }, [desiredStates]);

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
                        <DesiredStateIcon />
                        <Typography variant='h6' textAlign='left'>
                            目指す姿：アーカイブリスト
                        </Typography>
                    </Stack>
                    <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                        {desiredStates?.map(desiredState => {
                            return (
                                <Paper key={desiredState.id} sx={{ py: 1, px: 2 }}>
                                    <Stack direction='row' justifyContent='space-between'>
                                        <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                                            {desiredState.name}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                size='small'
                                                onClick={() => {
                                                    setSelectedDesiredState(desiredState);
                                                    setOpenedDialog('Unarchive');
                                                }}
                                            >
                                                <UnarchiveIcon />
                                            </IconButton>
                                            <IconButton
                                                size='small'
                                                onClick={() => {
                                                    setSelectedDesiredState(desiredState);
                                                    setOpenedDialog('Delete');
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Stack>
                                    <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                        {desiredState.description}
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

export default ArchivedDesiredStatesDialog;
