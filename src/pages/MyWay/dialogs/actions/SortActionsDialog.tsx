import { AppBar, Button, Card, Container, Dialog, DialogActions, DialogContent, Grid, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useActionContext from '../../../../hooks/useActionContext';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { closestCenter, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { Action } from '../../../../types/my_way';
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useLocalStorage from '../../../../hooks/useLocalStorage';

interface SortActionsDialogProps {
    onClose: () => void;
}

const SortActionsDialog = ({ onClose }: SortActionsDialogProps) => {
    const [actionIds, setActionIds] = useState<string[]>([]);
    const { actions: actionsMaster, bulkUpdateActionOrdering, getActions } = useActionContext();
    const { getActionTracksColumnsCount } = useLocalStorage();
    const actionTrackColumns = getActionTracksColumnsCount();

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over !== null && active.id !== over?.id) {
            setActionIds(prev => {
                const oldIndex = prev.indexOf(active.id as string);
                const newIndex = prev.indexOf(over.id as string);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const save = async () => {
        if (actionIds === undefined) return;
        bulkUpdateActionOrdering(actionIds).then(_ => {
            getActions();
            onClose();
        });
    };

    useEffect(() => {
        if (actionIds.length === 0 && actionsMaster !== undefined && actionsMaster.length > 0) {
            setActionIds(actionsMaster.map(action => action.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionsMaster]);

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ py: 4, backgroundColor: 'background.default' }}>
                <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant='dense'>
                        <Typography>活動：並び替え</Typography>
                    </Toolbar>
                </AppBar>
                <Container component='main' maxWidth='xs' sx={{ mt: 4, px: 0 }}>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={actionIds} strategy={rectSortingStrategy}>
                            <Grid container spacing={1}>
                                {actionIds?.map(id => {
                                    const action = actionsMaster!.find(action => action.id === id)!;
                                    return <SortableAction key={id} action={action} columns={actionTrackColumns} />;
                                })}
                            </Grid>
                        </SortableContext>
                    </DndContext>
                </Container>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2, bgcolor: 'background.default', borderTop: '1px solid #ccc' }}>
                <>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant='contained' onClick={save}>
                        保存する
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

interface SortableActionProps {
    action: Action;
    columns: 1 | 2 | 3;
}

const SortableAction = ({ action, columns }: SortableActionProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: action.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Grid ref={setNodeRef} style={style} {...attributes} {...listeners} size={12 / columns}>
            <Card sx={{ py: 1, px: 1, bgcolor: action.trackable ? '#fff' : 'background.default' }}>
                <Stack direction='row' alignItems='center'>
                    <DragIndicatorIcon htmlColor='grey' sx={{ p: 0.3 }} />
                    <span style={{ color: action?.color, paddingRight: '2px' }}>⚫︎</span>
                    <Typography
                        variant='body1'
                        sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', ml: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                        {action.name}
                    </Typography>
                </Stack>
            </Card>
        </Grid>
    );
};

export default SortActionsDialog;
