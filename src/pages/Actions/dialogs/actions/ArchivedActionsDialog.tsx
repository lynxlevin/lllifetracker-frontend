import { Grow, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import EjectIcon from '@mui/icons-material/Eject';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Action } from '../../../../types/my_way';
import useActionContext from '../../../../hooks/useActionContext';
import { ActionAPI } from '../../../../apis/ActionAPI';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import { TransitionGroup } from 'react-transition-group';
import HorizontalSwipeBox from '../../../../components/HorizontalSwipeBox';

interface ArchivedActionsDialogProps {
    onClose: () => void;
}

const ArchivedActionsDialog = ({ onClose }: ArchivedActionsDialogProps) => {
    const [actions, setActions] = useState<Action[]>();
    const { unarchiveAction, deleteAction } = useActionContext();

    const unArchiveItem = (action: Action) => {
        unarchiveAction(action.id);
        const index = actions!.indexOf(action);
        setActions(prev => [...prev!.slice(0, index), ...prev!.slice(index + 1)]);
    };
    const deleteItem = (action: Action) => {
        deleteAction(action.id);
        const index = actions!.indexOf(action);
        setActions(prev => [...prev!.slice(0, index), ...prev!.slice(index + 1)]);
    };

    useEffect(() => {
        if (actions === undefined) ActionAPI.list(true).then(res => setActions(res.data));
    }, [actions]);

    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterContent={<Typography variant="h6">活動：保管庫</Typography>}
            content={
                <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                    {actions?.map(action => {
                        return <ArchivedAction key={action.id} action={action} onUnArchive={unArchiveItem} onDelete={deleteItem} />;
                    })}
                </Stack>
            }
        />
    );
};

interface ArchivedActionProps {
    action: Action;
    onUnArchive: (action: Action) => void;
    onDelete: (action: Action) => void;
}
type DialogType = 'Unarchive' | 'Delete';

const ArchivedAction = ({ action, onUnArchive, onDelete }: ArchivedActionProps) => {
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
                            onUnArchive(action);
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
                            onDelete(action);
                            setOpenedDialog(undefined);
                        }}
                        title="活動：削除"
                        message={`「${action.name}」を完全に削除します。`}
                        actionName="削除する"
                    />
                );
        }
    };

    return (
        <>
            <HorizontalSwipeBox onSwipeLeft={swiped => setSwipedLeft(swiped)} keepSwipeState distance={100}>
                <TransitionGroup>
                    <Stack direction="row">
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
                                {action.description}
                            </Typography>
                        </Paper>
                        {swipedLeft && (
                            <Grow in={swipedLeft}>
                                <IconButton size="small" color="error" onClick={() => setOpenedDialog('Delete')}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grow>
                        )}
                    </Stack>
                </TransitionGroup>
            </HorizontalSwipeBox>
            {openedDialog && getDialog()}
        </>
    );
};

export default ArchivedActionsDialog;
