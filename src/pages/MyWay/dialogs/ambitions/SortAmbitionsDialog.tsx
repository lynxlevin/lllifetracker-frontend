import { AppBar, Button, Card, Container, Dialog, DialogActions, DialogContent, Grid, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { closestCenter, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { Ambition } from '../../../../types/my_way';
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortAmbitionsDialogProps {
    onClose: () => void;
}

const SortAmbitionsDialog = ({ onClose }: SortAmbitionsDialogProps) => {
    const [ambitionIds, setAmbitionIds] = useState<string[]>([]);
    const { ambitions: ambitionsMaster, bulkUpdateAmbitionOrdering, getAmbitions } = useAmbitionContext();

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over !== null && active.id !== over?.id) {
            setAmbitionIds(prev => {
                const oldIndex = prev.indexOf(active.id as string);
                const newIndex = prev.indexOf(over.id as string);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const save = async () => {
        if (ambitionIds === undefined) return;
        bulkUpdateAmbitionOrdering(ambitionIds).then(_ => {
            getAmbitions();
            onClose();
        });
    };

    useEffect(() => {
        if (ambitionIds.length === 0 && ambitionsMaster !== undefined && ambitionsMaster.length > 0) {
            setAmbitionIds(ambitionsMaster.map(ambition => ambition.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitionsMaster]);

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ padding: 4, backgroundColor: 'background.default' }}>
                <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant='dense'>
                        <Typography>大望：並び替え</Typography>
                    </Toolbar>
                </AppBar>
                <Container component='main' maxWidth='xs' sx={{ mt: 4 }}>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={ambitionIds} strategy={rectSortingStrategy}>
                            <Grid container spacing={2}>
                                {ambitionIds?.map(id => {
                                    const ambition = ambitionsMaster!.find(ambition => ambition.id === id)!;
                                    return <SortableAmbition key={id} ambition={ambition} />;
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

interface SortableAmbitionProps {
    ambition: Ambition;
}

const SortableAmbition = ({ ambition }: SortableAmbitionProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: ambition.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Grid ref={setNodeRef} style={style} {...attributes} {...listeners} size={12}>
            <Card sx={{ py: 1, px: 1 }}>
                <Stack direction='row' alignItems='center'>
                    <DragIndicatorIcon htmlColor='grey' sx={{ p: 0.3 }} />
                    <Typography
                        variant='body1'
                        sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', ml: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                        {ambition.name}
                    </Typography>
                </Stack>
            </Card>
        </Grid>
    );
};

export default SortAmbitionsDialog;
