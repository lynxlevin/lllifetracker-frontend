import { AppBar, Box, Dialog, DialogContent, IconButton, Paper, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import CloseIcon from '@mui/icons-material/Close';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Mindset } from '../../../types/my_way';
import useMindsetContext from '../../../hooks/useMindsetContext';
import { MindsetIcon } from '../../../components/CustomIcons';
import { MindsetAPI } from '../../../apis/MindsetAPI';
import { format } from 'date-fns';

interface ArchivedMindsetsDialogProps {
    onClose: () => void;
}
type DialogType = 'Unarchive' | 'Delete';

const ArchivedMindsetsDialog = ({ onClose }: ArchivedMindsetsDialogProps) => {
    const [mindsets, setMindsets] = useState<Mindset[]>();
    const [selectedMindset, setSelectedMindset] = useState<Mindset>();
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { unarchiveMindset, deleteMindset } = useMindsetContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Unarchive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedMindset(undefined);
                        }}
                        handleSubmit={() => {
                            unarchiveMindset(selectedMindset!.id);
                            setSelectedMindset(undefined);
                            setOpenedDialog(undefined);
                            const selectedMindsetIndex = mindsets!.indexOf(selectedMindset!);
                            setMindsets(prev => [...prev!.slice(0, selectedMindsetIndex), ...prev!.slice(selectedMindsetIndex + 1)]);
                        }}
                        title='心掛け：アンアーカイブ'
                        message={`「${selectedMindset!.name}」をアンアーカイブします。`}
                        actionName='アンアーカイブする'
                    />
                );
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedMindset(undefined);
                        }}
                        handleSubmit={() => {
                            deleteMindset(selectedMindset!.id);
                            setSelectedMindset(undefined);
                            setOpenedDialog(undefined);
                            const selectedMindsetIndex = mindsets!.indexOf(selectedMindset!);
                            setMindsets(prev => [...prev!.slice(0, selectedMindsetIndex), ...prev!.slice(selectedMindsetIndex + 1)]);
                        }}
                        title='心掛け：削除'
                        message={`「${selectedMindset!.name}」を完全に削除します。`}
                        actionName='削除する'
                    />
                );
        }
    };

    useEffect(() => {
        if (mindsets === undefined) MindsetAPI.list(true).then(res => setMindsets(res.data));
    }, [mindsets]);

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
                        <MindsetIcon />
                        <Typography variant='h6' textAlign='left'>
                            心掛け：アーカイブリスト
                        </Typography>
                    </Stack>
                    <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                        {mindsets?.map(mindset => {
                            return (
                                <Paper key={mindset.id} sx={{ py: 1, px: 2 }}>
                                    <Stack direction='row' justifyContent='space-between'>
                                        <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                                            {mindset.name}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                size='small'
                                                onClick={() => {
                                                    setSelectedMindset(mindset);
                                                    setOpenedDialog('Unarchive');
                                                }}
                                            >
                                                <UnarchiveIcon />
                                            </IconButton>
                                            <IconButton
                                                size='small'
                                                onClick={() => {
                                                    setSelectedMindset(mindset);
                                                    setOpenedDialog('Delete');
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Stack>
                                    <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                        {mindset.description}
                                    </Typography>
                                    <Typography variant='body2' fontWeight={100} pt={2} textAlign='right'>
                                        アーカイブした日:{format(new Date(mindset.updated_at), 'yyyy-MM-dd')}
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

export default ArchivedMindsetsDialog;
