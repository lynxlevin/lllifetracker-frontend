import { Grow, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import EjectIcon from '@mui/icons-material/Eject';
import DeleteIcon from '@mui/icons-material/Delete';
import type { DesiredState } from '../../../../types/my_way';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import { DesiredStateAPI } from '../../../../apis/DesiredStateAPI';
import useDesiredStateCategoryContext from '../../../../hooks/useDesiredStateCategoryContext';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import { TransitionGroup } from 'react-transition-group';
import HorizontalSwipeBox from '../../../../components/HorizontalSwipeBox';

interface ArchivedDesiredStatesDialogProps {
    onClose: () => void;
}

const ArchivedDesiredStatesDialog = ({ onClose }: ArchivedDesiredStatesDialogProps) => {
    const [desiredStates, setDesiredStates] = useState<DesiredState[]>();
    const { unarchiveDesiredState, deleteDesiredState } = useDesiredStateContext();
    const { cmpDesiredStatesByCategory } = useDesiredStateCategoryContext();

    const unArchiveItem = (desiredState: DesiredState) => {
        unarchiveDesiredState(desiredState.id);
        const index = desiredStates!.indexOf(desiredState);
        setDesiredStates(prev => [...prev!.slice(0, index), ...prev!.slice(index + 1)]);
    };
    const deleteItem = (desiredState: DesiredState) => {
        deleteDesiredState(desiredState.id);
        const index = desiredStates!.indexOf(desiredState);
        setDesiredStates(prev => [...prev!.slice(0, index), ...prev!.slice(index + 1)]);
    };
    let lastCategoryId: string | null;

    useEffect(() => {
        if (desiredStates === undefined) DesiredStateAPI.list(true).then(res => setDesiredStates(res.data));
    }, [desiredStates]);
    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterContent={<Typography>大事にすること：保管庫</Typography>}
            content={
                <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                    {desiredStates?.sort(cmpDesiredStatesByCategory).map(desiredState => {
                        const isFirstOfCategory = lastCategoryId !== desiredState.category_id;
                        lastCategoryId = desiredState.category_id;
                        return (
                            <ArchivedDesiredState
                                key={desiredState.id}
                                desiredState={desiredState}
                                isFirstOfCategory={isFirstOfCategory}
                                onUnArchive={unArchiveItem}
                                onDelete={deleteItem}
                            />
                        );
                    })}
                </Stack>
            }
        />
    );
};

interface ArchivedDesiredStateProps {
    desiredState: DesiredState;
    isFirstOfCategory: boolean;
    onUnArchive: (desiredState: DesiredState) => void;
    onDelete: (desiredState: DesiredState) => void;
}
type DialogType = 'Unarchive' | 'Delete';

const ArchivedDesiredState = ({ desiredState, isFirstOfCategory, onUnArchive, onDelete }: ArchivedDesiredStateProps) => {
    const [swipedLeft, setSwipedLeft] = useState(false);
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const { categoryMap } = useDesiredStateCategoryContext();
    const category = categoryMap.get(desiredState.category_id);

    const getDialog = () => {
        switch (openedDialog) {
            case 'Unarchive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            onUnArchive(desiredState);
                            setOpenedDialog(undefined);
                        }}
                        title="大事にすること：保管庫から出す"
                        message={`「${desiredState.name}」を保管庫から出します。`}
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
                            onDelete(desiredState);
                            setOpenedDialog(undefined);
                        }}
                        title="大事にすること：削除"
                        message={`「${desiredState.name}」を完全に削除します。`}
                        actionName="削除"
                        actionColor="error"
                    />
                );
        }
    };

    return (
        <>
            {isFirstOfCategory && (
                <Typography fontSize="1rem" mt={1}>
                    {category?.name ?? 'カテゴリーなし'}
                </Typography>
            )}
            <HorizontalSwipeBox onSwipeLeft={swiped => setSwipedLeft(swiped)} keepSwipeState distance={100}>
                <Stack direction="row" alignItems="center">
                    <Paper sx={{ py: 1, px: 2, flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                                {desiredState.name}
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
                            {desiredState.description}
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

export default ArchivedDesiredStatesDialog;
