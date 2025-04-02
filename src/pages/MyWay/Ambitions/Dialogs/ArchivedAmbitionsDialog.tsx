import { AppBar, Box, Dialog, DialogContent, IconButton, Paper, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import CloseIcon from '@mui/icons-material/Close';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Ambition } from '../../../../types/ambition';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import { AmbitionIcon } from '../../../../components/CustomIcons';

interface ArchivedAmbitionsDialogProps {
    onClose: () => void;
}
type DialogType = 'Unarchive' | 'Delete';

const ArchivedAmbitionsDialog = ({ onClose }: ArchivedAmbitionsDialogProps) => {
    const [ambitions, setAmbitions] = useState<Ambition[]>();
    const [selectedAmbition, setSelectedAmbition] = useState<Ambition>();
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    // const {unarchiveAmbition, deleteAmbition} = useAmbitionContext();
    const { ambitions: ambitionsInContext } = useAmbitionContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Unarchive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedAmbition(undefined);
                        }}
                        handleSubmit={() => {
                            // unarchiveAmbition(selectedAmbition.id);
                            setSelectedAmbition(undefined);
                            setOpenedDialog(undefined);
                        }}
                        title='大望：アンアーカイブ'
                        message={`「${selectedAmbition!.name}」をアンアーカイブします。`}
                        actionName='アンアーカイブする'
                    />
                );
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedAmbition(undefined);
                        }}
                        handleSubmit={() => {
                            // deleteAmbition(selectedAmbition.id);
                            setSelectedAmbition(undefined);
                            setOpenedDialog(undefined);
                        }}
                        title='大望：削除'
                        message={`「${selectedAmbition!.name}」を完全に削除します。`}
                        actionName='削除する'
                    />
                );
        }
    };

    useEffect(() => {
        if (ambitions === undefined) setAmbitions(ambitionsInContext);
    }, [ambitions, ambitionsInContext]);

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
                        <AmbitionIcon />
                        <Typography variant='h6' textAlign='left'>
                            大望：アーカイブリスト
                        </Typography>
                    </Stack>
                    <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                        {ambitions?.map(ambition => {
                            return (
                                <Paper key={ambition.id} sx={{ py: 1, px: 2 }}>
                                    <Stack direction='row' justifyContent='space-between'>
                                        <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                                            {ambition.name}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                size='small'
                                                onClick={() => {
                                                    setSelectedAmbition(ambition);
                                                    setOpenedDialog('Unarchive');
                                                }}
                                            >
                                                <UnarchiveIcon />
                                            </IconButton>
                                            <IconButton
                                                size='small'
                                                onClick={() => {
                                                    setSelectedAmbition(ambition);
                                                    setOpenedDialog('Delete');
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Stack>
                                    <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                        {ambition.description}
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

export default ArchivedAmbitionsDialog;
