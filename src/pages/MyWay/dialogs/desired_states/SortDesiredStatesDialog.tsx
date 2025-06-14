import { AppBar, Box, Button, Card, Container, Dialog, DialogActions, DialogContent, Grid, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { moveItemDown, moveItemUp } from '../../../../hooks/useArraySort';
import type { DesiredState } from '../../../../types/my_way';
import useDesiredStateCategoryContext from '../../../../hooks/useDesiredStateCategoryContext';

interface SortDesiredStatesDialogProps {
    onClose: () => void;
}

const SortDesiredStatesDialog = ({ onClose }: SortDesiredStatesDialogProps) => {
    const [desiredStateIds, setDesiredStateIds] = useState<string[]>([]);
    const { desiredStates: desiredStatesMaster, bulkUpdateDesiredStateOrdering, getDesiredStates } = useDesiredStateContext();
    const { desiredStateCategories } = useDesiredStateCategoryContext();

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
            <DialogContent sx={{ pt: 4, backgroundColor: 'background.default' }}>
                <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant='dense'>
                        <Typography>目指す姿：並び替え</Typography>
                    </Toolbar>
                </AppBar>
                <Container component='main' maxWidth='xs' sx={{ mt: 4, p: 0 }}>
                    <Grid container spacing={1}>
                        {desiredStateIds
                            ?.sort((a, b) => {
                                const desiredStateA = desiredStatesMaster!.find(desiredState => desiredState.id === a)!;
                                const desiredStateB = desiredStatesMaster!.find(desiredState => desiredState.id === b)!;
                                return (
                                    desiredStateCategories?.findIndex(category => category.id === desiredStateA.category_id)! -
                                    desiredStateCategories?.findIndex(category => category.id === desiredStateB.category_id)!
                                );
                            })
                            .map((id: string, idx) => {
                                const desiredState = desiredStatesMaster!.find(desiredState => desiredState.id === id)!;
                                const isFirstOfCategory =
                                    idx === 0 ||
                                    desiredStatesMaster!.find(desiredState => desiredState.id === desiredStateIds[idx - 1])!.category_id !==
                                        desiredState.category_id;
                                const isLastOfCategory =
                                    idx === desiredStateIds.length - 1 ||
                                    desiredStatesMaster!.find(desiredState => desiredState.id === desiredStateIds[idx + 1])!.category_id !==
                                        desiredState.category_id;
                                return (
                                    <Box key={id} width='100%'>
                                        {isFirstOfCategory && (
                                            <Typography>{desiredStateCategories?.find(category => category.id === desiredState.category_id)?.name}</Typography>
                                        )}
                                        <SortItem
                                            desiredState={desiredState}
                                            idx={idx}
                                            desiredStateIdsLength={desiredStateIds.length}
                                            setDesiredStateIds={setDesiredStateIds}
                                            disableMoveUp={isFirstOfCategory}
                                            disableMoveDown={isLastOfCategory}
                                        />
                                    </Box>
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
    desiredState,
    idx,
    desiredStateIdsLength,
    setDesiredStateIds,
    disableMoveUp,
    disableMoveDown,
}: {
    desiredState: DesiredState;
    idx: number;
    desiredStateIdsLength: number;
    setDesiredStateIds: (value: React.SetStateAction<string[]>) => void;
    disableMoveUp: boolean;
    disableMoveDown: boolean;
}) => {
    const handleUp = (idx: number) => {
        if (idx === 0) return;
        setDesiredStateIds(prev => moveItemUp(prev, idx));
    };

    const handleDown = (idx: number) => {
        if (idx === desiredStateIdsLength - 1) return;
        setDesiredStateIds(prev => moveItemDown(prev, idx));
    };

    return (
        <Grid size={12}>
            <Stack direction='row'>
                <Card sx={{ py: 1, px: 1, width: '100%' }}>
                    <Stack justifyContent='center' height='100%'>
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
                            {desiredState.name}
                        </Typography>
                    </Stack>
                </Card>
                <IconButton
                    size='small'
                    onClick={() => {
                        handleUp(idx);
                    }}
                    disabled={disableMoveUp}
                >
                    <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                    size='small'
                    onClick={() => {
                        handleDown(idx);
                    }}
                    disabled={disableMoveDown}
                >
                    <ArrowDownwardIcon />
                </IconButton>
            </Stack>
        </Grid>
    );
};

export default SortDesiredStatesDialog;
