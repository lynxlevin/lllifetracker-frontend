import { AppBar, Button, Card, Container, Dialog, DialogActions, DialogContent, Grid, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useMindsetContext from '../../../../hooks/useMindsetContext';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { closestCenter, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { Mindset } from '../../../../types/my_way';
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortMindsetsDialogProps {
    onClose: () => void;
}

const SortMindsetsDialog = ({ onClose }: SortMindsetsDialogProps) => {
    const [mindsetIds, setMindsetIds] = useState<string[]>([]);
    const { mindsets: mindsetsMaster, bulkUpdateMindsetOrdering, getMindsets } = useMindsetContext();

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over !== null && active.id !== over?.id) {
            setMindsetIds(prev => {
                const oldIndex = prev.indexOf(active.id as string);
                const newIndex = prev.indexOf(over.id as string);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const save = async () => {
        if (mindsetIds === undefined) return;
        bulkUpdateMindsetOrdering(mindsetIds).then(_ => {
            getMindsets();
            onClose();
        });
    };

    useEffect(() => {
        if (mindsetIds.length === 0 && mindsetsMaster !== undefined && mindsetsMaster.length > 0) {
            setMindsetIds(mindsetsMaster.map(mindset => mindset.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mindsetsMaster]);

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ padding: 4, backgroundColor: 'background.default' }}>
                <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant='dense'>
                        <Typography>心掛け：並び替え</Typography>
                    </Toolbar>
                </AppBar>
                <Container component='main' maxWidth='xs' sx={{ mt: 4 }}>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={mindsetIds} strategy={rectSortingStrategy}>
                            <Grid container spacing={2}>
                                {mindsetIds?.map(id => {
                                    const mindset = mindsetsMaster!.find(mindset => mindset.id === id)!;
                                    return <SortableMindset key={id} mindset={mindset} />;
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

interface SortableMindsetProps {
    mindset: Mindset;
}

const SortableMindset = ({ mindset }: SortableMindsetProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: mindset.id });

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
                        {mindset.name}
                    </Typography>
                </Stack>
            </Card>
        </Grid>
    );
};

export default SortMindsetsDialog;
