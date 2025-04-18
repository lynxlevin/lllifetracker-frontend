import { AppBar, Button, Card, Container, Dialog, DialogActions, DialogContent, Grid2 as Grid, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface SortAmbitionsDialogProps {
    onClose: () => void;
}

const SortAmbitionsDialog = ({ onClose }: SortAmbitionsDialogProps) => {
    const [ambitions, setAmbitions] = useState<{ id: string; name: string; sortNumber: number }[]>();

    const { ambitions: ambitionsMaster, bulkUpdateAmbitionOrdering, getAmbitions } = useAmbitionContext();

    const setSortNumber = (id: string, sortNumber: number) => {
        setAmbitions(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === id)!.sortNumber = sortNumber;
            return toBe;
        });
    };

    const save = async () => {
        if (ambitions === undefined) return;
        ambitions.sort((a, b) => a.sortNumber - b.sortNumber);
        bulkUpdateAmbitionOrdering(ambitions.map(ambition => ambition.id)).then(_ => {
            getAmbitions();
            onClose();
        });
    };

    useEffect(() => {
        if (ambitions === undefined && ambitionsMaster !== undefined) {
            const ambitionsToSet = ambitionsMaster.map((ambition, index) => {
                return {
                    id: ambition.id,
                    name: ambition.name,
                    sortNumber: index + 1,
                };
            });
            setAmbitions(ambitionsToSet);
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
                    <Grid container spacing={2}>
                        {ambitions?.map(ambition => {
                            return (
                                <Grid key={ambition.id} size={12}>
                                    <Card sx={{ py: 1, px: 1 }}>
                                        <Stack direction='row' alignItems='center'>
                                            <DragIndicatorIcon htmlColor='grey' sx={{ p: 0.3 }} />
                                            <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', ml: 0.5 }}>
                                                {ambition.name}
                                            </Typography>
                                        </Stack>
                                    </Card>
                                </Grid>
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

export default SortAmbitionsDialog;
