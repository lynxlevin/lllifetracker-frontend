import { Grow, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import EjectIcon from '@mui/icons-material/Eject';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Action } from '../../../../types/my_way';
import useActionContext from '../../../../hooks/useActionContext';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import { TransitionGroup } from 'react-transition-group';
import HorizontalSwipeBox from '../../../../components/HorizontalSwipeBox';

interface ArchivedActionsDialogProps {
    onClose: () => void;
}

const ArchivedActionsDialog = ({ onClose }: ArchivedActionsDialogProps) => {
    const { archivedActions, getActions, isLoading } = useActionContext();

    useEffect(() => {
        if (archivedActions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [archivedActions, getActions]);

    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterText="活動：保管庫"
            content={
                <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                    {archivedActions?.map(action => {
                        return <ArchivedAction key={action.id} action={action} />;
                    })}
                </Stack>
            }
        />
    );
};

interface ArchivedActionProps {
    action: Action;
}
type DialogType = 'Unarchive' | 'Delete';

const ArchivedAction = ({ action }: ArchivedActionProps) => {
    const { unarchiveAction, deleteAction } = useActionContext();
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
                            unarchiveAction(action.id);
                            setOpenedDialog(undefined);
                        }}
                        title="活動：保管庫から出す"
                        message={`「${action.name}」を保管庫から出します。`}
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
                            deleteAction(action.id);
                            setOpenedDialog(undefined);
                        }}
                        title="活動：削除"
                        message={`「${action.name}」を完全に削除します。`}
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
                            <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                                {action.name}
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
                            {action.discipline}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                            {action.memo}
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

export default ArchivedActionsDialog;
