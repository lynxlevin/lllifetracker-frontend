import { AppBar, Button, Card, Container, Dialog, DialogActions, DialogContent, Grid, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { moveItemDown, moveItemUp } from '../../../../hooks/useArraySort';
import type { Ambition } from '../../../../types/my_way';

interface SortAmbitionsDialogProps {
    onClose: () => void;
}

const SortAmbitionsDialog = ({ onClose }: SortAmbitionsDialogProps) => {
    const [ambitionIds, setAmbitionIds] = useState<string[]>([]);
    const { ambitions: ambitionsMaster, bulkUpdateAmbitionOrdering, getAmbitions } = useAmbitionContext();

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
            <DialogContent sx={{ pt: 4, backgroundColor: 'background.default' }}>
                <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant='dense'>
                        <Typography>大望：並び替え</Typography>
                    </Toolbar>
                </AppBar>
                <Container component='main' maxWidth='xs' sx={{ mt: 4, p: 0 }}>
                    <Grid container spacing={1}>
                        {ambitionIds?.map((id, idx) => {
                            return (
                                <SortItem
                                    key={id}
                                    ambition={ambitionsMaster!.find(ambition => ambition.id === id)!}
                                    ambitionIdsLength={ambitionIds.length}
                                    setAmbitionIds={setAmbitionIds}
                                    idx={idx}
                                />
                            );
                        })}
                    </Grid>
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

const SortItem = ({
    ambition,
    idx,
    ambitionIdsLength,
    setAmbitionIds,
}: { ambition: Ambition; idx: number; ambitionIdsLength: number; setAmbitionIds: (value: React.SetStateAction<string[]>) => void }) => {
    const handleUp = (idx: number) => {
        if (idx === 0) return;
        setAmbitionIds(prev => moveItemUp(prev, idx));
    };

    const handleDown = (idx: number) => {
        if (idx === ambitionIdsLength - 1) return;
        setAmbitionIds(prev => moveItemDown(prev, idx));
    };

    return (
        <Grid size={12}>
            <Stack direction='row'>
                <Card sx={{ py: 1, px: 1, width: '100%' }}>
                    <Stack direction='row' alignItems='center' height='100%'>
                        <Typography
                            variant='body1'
                            sx={{
                                textShadow: 'lightgrey 0.4px 0.4px 0.5px',
                                ml: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {ambition.name}
                        </Typography>
                    </Stack>
                </Card>
                <IconButton
                    size='small'
                    onClick={() => {
                        handleUp(idx);
                    }}
                    disabled={idx === 0}
                >
                    <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                    size='small'
                    onClick={() => {
                        handleDown(idx);
                    }}
                    disabled={idx === ambitionIdsLength - 1}
                >
                    <ArrowDownwardIcon />
                </IconButton>
            </Stack>
        </Grid>
    );
};

export default SortAmbitionsDialog;
