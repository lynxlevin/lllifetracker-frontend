import { Grow, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import EjectIcon from '@mui/icons-material/Eject';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Direction } from '../../../../types/my_way';
import useDirectionContext from '../../../../hooks/useDirectionContext';
import useDirectionCategoryContext from '../../../../hooks/useDirectionCategoryContext';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import { TransitionGroup } from 'react-transition-group';
import HorizontalSwipeBox from '../../../../components/HorizontalSwipeBox';
import DirectionDetails from './DirectionDetails';

interface ArchivedDirectionsDialogProps {
    onClose: () => void;
}

const ArchivedDirectionsDialog = ({ onClose }: ArchivedDirectionsDialogProps) => {
    const { archivedDirections, getDirections, isLoading } = useDirectionContext();
    const { cmpDirectionsByCategory } = useDirectionCategoryContext();

    let lastCategoryId: string | null;

    useEffect(() => {
        if (archivedDirections === undefined && !isLoading) getDirections();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [archivedDirections, getDirections]);
    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterText="指針：保管庫"
            content={
                <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                    {archivedDirections?.sort(cmpDirectionsByCategory).map(direction => {
                        const isFirstOfCategory = lastCategoryId !== direction.category_id;
                        lastCategoryId = direction.category_id;
                        return <ArchivedDirection key={direction.id} direction={direction} isFirstOfCategory={isFirstOfCategory} />;
                    })}
                </Stack>
            }
        />
    );
};

interface ArchivedDirectionProps {
    direction: Direction;
    isFirstOfCategory: boolean;
}
type DialogType = 'Details' | 'Unarchive' | 'Delete';

const ArchivedDirection = ({ direction, isFirstOfCategory }: ArchivedDirectionProps) => {
    const { unarchiveDirection, deleteDirection } = useDirectionContext();
    const [swipedLeft, setSwipedLeft] = useState(false);
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const { categoryMap } = useDirectionCategoryContext();
    const category = categoryMap.get(direction.category_id);

    const getDialog = () => {
        switch (openedDialog) {
            case 'Details':
                return <DirectionDetails direction={direction} onClose={() => setOpenedDialog(undefined)} />;
            case 'Unarchive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            unarchiveDirection(direction.id);
                            setOpenedDialog(undefined);
                        }}
                        title="指針：保管庫から出す"
                        message={`「${direction.name}」を保管庫から出します。`}
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
                            deleteDirection(direction.id);
                            setOpenedDialog(undefined);
                        }}
                        title="指針：削除"
                        message={`「${direction.name}」を完全に削除します。`}
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
                    <Paper sx={{ py: 1, px: 2, flexGrow: 1 }} onClick={() => setOpenedDialog('Details')}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                                {direction.name}
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
                            {direction.description}
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

export default ArchivedDirectionsDialog;
