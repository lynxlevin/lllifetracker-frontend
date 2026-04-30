import { Grow, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import EjectIcon from '@mui/icons-material/Eject';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Ambition } from '../../../../types/my_way';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import { TransitionGroup } from 'react-transition-group';
import HorizontalSwipeBox from '../../../../components/HorizontalSwipeBox';
import AmbitionDetails from './AmbitionDetails';

interface ArchivedAmbitionsDialogProps {
    onClose: () => void;
}

const ArchivedAmbitionsDialog = ({ onClose }: ArchivedAmbitionsDialogProps) => {
    const { archivedAmbitions, getAmbitions, isLoading } = useAmbitionContext();

    useEffect(() => {
        if (archivedAmbitions === undefined && !isLoading) getAmbitions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [archivedAmbitions, getAmbitions]);

    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterText="大望：保管庫"
            content={
                <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                    {archivedAmbitions?.map(ambition => {
                        return <ArchivedAmbition key={ambition.id} ambition={ambition} />;
                    })}
                </Stack>
            }
        />
    );
};

interface ArchivedAmbitionProps {
    ambition: Ambition;
}
type DialogType = 'Details' | 'Unarchive' | 'Delete';

const ArchivedAmbition = ({ ambition }: ArchivedAmbitionProps) => {
    const { unarchiveAmbition, deleteAmbition } = useAmbitionContext();
    const [swipedLeft, setSwipedLeft] = useState(false);
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Details':
                return <AmbitionDetails ambition={ambition} onClose={() => setOpenedDialog(undefined)} />;
            case 'Unarchive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            unarchiveAmbition(ambition.id);
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
                            deleteAmbition(ambition.id);
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
            <HorizontalSwipeBox onSwipeLeft={swiped => setSwipedLeft(swiped)} distance={100}>
                <Stack direction="row" alignItems="center">
                    <Paper sx={{ py: 1, px: 2, flexGrow: 1 }} onClick={() => setOpenedDialog('Details')}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                                {ambition.name}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={e => {
                                    e.stopPropagation();
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
