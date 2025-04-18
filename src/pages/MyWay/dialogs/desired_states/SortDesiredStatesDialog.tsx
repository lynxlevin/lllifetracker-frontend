import { AppBar, Button, Card, Container, Dialog, DialogActions, DialogContent, Grid2 as Grid, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { closestCenter, DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DesiredState } from '../../../../types/my_way';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortDesiredStatesDialogProps {
    onClose: () => void;
}

const SortDesiredStatesDialog = ({ onClose }: SortDesiredStatesDialogProps) => {
    const [desiredStateIds, setDesiredStateIds] = useState<string[]>([]);
    const { desiredStates: desiredStatesMaster, bulkUpdateDesiredStateOrdering, getDesiredStates } = useDesiredStateContext();

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over !== null && active.id !== over?.id) {
            setDesiredStateIds(prev => {
                const oldIndex = prev.indexOf(active.id as string);
                const newIndex = prev.indexOf(over.id as string);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const save = async () => {
        if (desiredStateIds === undefined) return;
        bulkUpdateDesiredStateOrdering(desiredStateIds).then(_ => {
            getDesiredStates();
            onClose();
        });
    };

    useEffect(() => {
        if (desiredStateIds.length === 0 && desiredStatesMaster !== undefined && desiredStatesMaster.length > 0) {
            setDesiredStateIds(desiredStatesMaster.map(desiredState => desiredState.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStatesMaster]);

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ padding: 4, backgroundColor: 'background.default' }}>
                <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant='dense'>
                        <Typography>目指す姿：並び替え</Typography>
                    </Toolbar>
                </AppBar>
                <Container component='main' maxWidth='xs' sx={{ mt: 4 }}>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={desiredStateIds} strategy={verticalListSortingStrategy}>
                            <Grid container spacing={2}>
                                {desiredStateIds?.map(id => {
                                    const desiredState = desiredStatesMaster!.find(desiredState => desiredState.id === id)!;
                                    return <SortableDesiredState key={id} desiredState={desiredState} />;
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

interface SortableDesiredStateProps {
    desiredState: DesiredState;
}

const SortableDesiredState = ({ desiredState }: SortableDesiredStateProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: desiredState.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Grid ref={setNodeRef} style={style} {...attributes} {...listeners} size={12}>
            <Card sx={{ py: 1, px: 1 }}>
                <Stack direction='row' alignItems='center'>
                    <DragIndicatorIcon htmlColor='grey' sx={{ p: 0.3 }} />
                    <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', ml: 0.5 }}>
                        {desiredState.name}
                    </Typography>
                </Stack>
            </Card>
        </Grid>
    );
};

export default SortDesiredStatesDialog;
