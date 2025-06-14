import { AppBar, Button, Card, Container, Dialog, DialogActions, DialogContent, Grid, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';

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
            <DialogContent sx={{ padding: 4, backgroundColor: 'background.default' }}>
                <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant='dense'>
                        <Typography>大望：並び替え</Typography>
                    </Toolbar>
                </AppBar>
                <Container component='main' maxWidth='xs' sx={{ mt: 4 }}>
                    <Grid container spacing={2}>
                        {ambitionIds?.map(id => {
                            const ambition = ambitionsMaster!.find(ambition => ambition.id === id)!;
                            return (
                                <Grid key={id} size={12}>
                                    <Card sx={{ py: 1, px: 1 }}>
                                        <Stack direction='row' alignItems='center'>
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
