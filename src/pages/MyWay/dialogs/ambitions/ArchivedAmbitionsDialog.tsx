import { Grow, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import EjectIcon from '@mui/icons-material/Eject';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Ambition } from '../../../../types/my_way';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import { AmbitionAPI } from '../../../../apis/AmbitionAPI';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import { TransitionGroup } from 'react-transition-group';
import HorizontalSwipeBox from '../../../../components/HorizontalSwipeBox';

interface ArchivedAmbitionsDialogProps {
    onClose: () => void;
}

const ArchivedAmbitionsDialog = ({ onClose }: ArchivedAmbitionsDialogProps) => {
    const [ambitions, setAmbitions] = useState<Ambition[]>();
    const { unarchiveAmbition, deleteAmbition } = useAmbitionContext();

    const unArchiveItem = (ambition: Ambition) => {
        unarchiveAmbition(ambition.id);
        const index = ambitions!.indexOf(ambition);
        setAmbitions(prev => [...prev!.slice(0, index), ...prev!.slice(index + 1)]);
    };
    const deleteItem = (ambition: Ambition) => {
        deleteAmbition(ambition.id);
        const index = ambitions!.indexOf(ambition);
        setAmbitions(prev => [...prev!.slice(0, index), ...prev!.slice(index + 1)]);
    };

    useEffect(() => {
        if (ambitions === undefined) AmbitionAPI.list(true).then(res => setAmbitions(res.data));
    }, [ambitions]);

    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterText="大望：保管庫"
            content={
                <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                    {ambitions?.map(ambition => {
                        return <ArchivedAmbition key={ambition.id} ambition={ambition} onUnArchive={unArchiveItem} onDelete={deleteItem} />;
                    })}
                </Stack>
            }
        />
    );
};

interface ArchivedAmbitionProps {
    ambition: Ambition;
    onUnArchive: (ambition: Ambition) => void;
    onDelete: (ambition: Ambition) => void;
}
type DialogType = 'Unarchive' | 'Delete';

const ArchivedAmbition = ({ ambition, onUnArchive, onDelete }: ArchivedAmbitionProps) => {
    const [swipedLeft, setSwipedLeft] = useState(false);
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Unarchive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            onUnArchive(ambition);
                            setOpenedDialog(undefined);
                        }}
                        title="大望：保管庫から出す"
                        message={`「${ambition.name}」を保管庫から出します。`}
                        actionName="保管庫から出す"
                    />
                );
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            onDelete(ambition);
                            setOpenedDialog(undefined);
                        }}
                        title="大望：削除"
                        message={`「${ambition.name}」を完全に削除します。`}
                        actionName="削除"
                        actionColor="error"
                    />
                );
        }
    };

    return (
        <>
            <HorizontalSwipeBox onSwipeLeft={swiped => setSwipedLeft(swiped)} keepSwipeState distance={100}>
                <Stack direction="row" alignItems="center">
                    <Paper sx={{ py: 1, px: 2, flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                                {ambition.name}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => {
                                    setOpenedDialog('Unarchive');
                                }}
                            >
                                <EjectIcon />
                            </IconButton>
                        </Stack>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                            {ambition.description}
                        </Typography>
                    </Paper>
                    <TransitionGroup>
                        {swipedLeft && (
                            <Grow in={swipedLeft}>
                                <IconButton size="small" color="error" onClick={() => setOpenedDialog('Delete')}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grow>
                        )}
                    </TransitionGroup>
                </Stack>
            </HorizontalSwipeBox>
            {openedDialog && getDialog()}
        </>
    );
};

export default ArchivedAmbitionsDialog;
