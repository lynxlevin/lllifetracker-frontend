import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Ambition } from '../../../../types/my_way';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import { AmbitionIcon } from '../../../../components/CustomIcons';
import { AmbitionAPI } from '../../../../apis/AmbitionAPI';
import { format } from 'date-fns';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

interface ArchivedAmbitionsDialogProps {
    onClose: () => void;
}
type DialogType = 'Unarchive' | 'Delete';

const ArchivedAmbitionsDialog = ({ onClose }: ArchivedAmbitionsDialogProps) => {
    const [ambitions, setAmbitions] = useState<Ambition[]>();
    const [selectedAmbition, setSelectedAmbition] = useState<Ambition>();
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { unarchiveAmbition, deleteAmbition } = useAmbitionContext();

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
                            unarchiveAmbition(selectedAmbition!.id);
                            setSelectedAmbition(undefined);
                            setOpenedDialog(undefined);
                            const selectedAmbitionIndex = ambitions!.indexOf(selectedAmbition!);
                            setAmbitions(prev => [...prev!.slice(0, selectedAmbitionIndex), ...prev!.slice(selectedAmbitionIndex + 1)]);
                        }}
                        title="大志：保留取りやめ"
                        message={`「${selectedAmbition!.name}」の保留を取りやめにします。`}
                        actionName="保留取りやめにする"
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
                            deleteAmbition(selectedAmbition!.id);
                            setSelectedAmbition(undefined);
                            setOpenedDialog(undefined);
                            const selectedAmbitionIndex = ambitions!.indexOf(selectedAmbition!);
                            setAmbitions(prev => [...prev!.slice(0, selectedAmbitionIndex), ...prev!.slice(selectedAmbitionIndex + 1)]);
                        }}
                        title="大志：削除"
                        message={`「${selectedAmbition!.name}」を完全に削除します。`}
                        actionName="削除する"
                    />
                );
        }
    };

    useEffect(() => {
        if (ambitions === undefined) AmbitionAPI.list(true).then(res => setAmbitions(res.data));
    }, [ambitions]);

    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterContent={
                <Stack direction="row">
                    <AmbitionIcon />
                    <Typography variant="h6" textAlign="left">
                        大志：保留リスト
                    </Typography>
                </Stack>
            }
            content={
                <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                    {ambitions?.map(ambition => {
                        return (
                            <Paper key={ambition.id} sx={{ py: 1, px: 2 }}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                                        {ambition.name}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setSelectedAmbition(ambition);
                                                setOpenedDialog('Unarchive');
                                            }}
                                        >
                                            <UnarchiveIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setSelectedAmbition(ambition);
                                                setOpenedDialog('Delete');
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Stack>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                    {ambition.description}
                                </Typography>
                                <Typography variant="body2" fontWeight={100} pt={2} textAlign="right">
                                    保留にした日:{format(new Date(ambition.updated_at), 'yyyy-MM-dd')}
                                </Typography>
                            </Paper>
                        );
                    })}
                    {openedDialog && getDialog()}
                </Stack>
            }
        />
    );
};

export default ArchivedAmbitionsDialog;
