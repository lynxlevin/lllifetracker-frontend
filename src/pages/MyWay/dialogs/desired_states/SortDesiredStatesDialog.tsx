import { Box, Button, Card, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { moveItemDown, moveItemUp } from '../../../../hooks/useArraySort';
import type { DesiredState } from '../../../../types/my_way';
import useDesiredStateCategoryContext from '../../../../hooks/useDesiredStateCategoryContext';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

interface SortDesiredStatesDialogProps {
    onClose: () => void;
}

const SortDesiredStatesDialog = ({ onClose }: SortDesiredStatesDialogProps) => {
    const [desiredStateIds, setDesiredStateIds] = useState<string[]>([]);
    const { desiredStates: desiredStatesMaster, bulkUpdateDesiredStateOrdering, getDesiredStates } = useDesiredStateContext();
    const { categoryMap, cmpDesiredStatesByCategory } = useDesiredStateCategoryContext();

    const desiredStateMap = useMemo(() => {
        const map = new Map<string, DesiredState>();
        if (desiredStatesMaster === undefined) return map;
        for (const master of desiredStatesMaster) {
            map.set(master.id, master);
        }
        return map;
    }, [desiredStatesMaster]);

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
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterContent={<Typography variant="h6">大事にすること：並び替え</Typography>}
            content={
                <Grid container spacing={1}>
                    {desiredStateIds
                        ?.sort((a, b) => {
                            const desiredStateA = desiredStateMap.get(a)!;
                            const desiredStateB = desiredStateMap.get(b)!;
                            return cmpDesiredStatesByCategory(desiredStateA, desiredStateB);
                        })
                        .map((id: string, idx) => {
                            const desiredState = desiredStateMap.get(id)!;
                            const isFirstOfCategory = idx === 0 || desiredStateMap.get(desiredStateIds[idx - 1])!.category_id !== desiredState.category_id;
                            const isLastOfCategory =
                                idx === desiredStateIds.length - 1 || desiredStateMap.get(desiredStateIds[idx + 1])!.category_id !== desiredState.category_id;
                            return (
                                <Box key={id} width="100%">
                                    {isFirstOfCategory && (
                                        <Typography>
                                            {desiredState.category_id === null ? 'カテゴリーなし' : categoryMap.get(desiredState.category_id)?.name}
                                        </Typography>
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
            }
            bottomPart={
                <>
                    <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant="contained" onClick={save}>
                        保存する
                    </Button>
                </>
            }
        />
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
            <Stack direction="row">
                <Card sx={{ py: 1, px: 1, width: '100%' }}>
                    <Stack justifyContent="center" height="100%">
                        <Typography
                            variant="body1"
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
                    size="small"
                    onClick={() => {
                        handleUp(idx);
                    }}
                    disabled={disableMoveUp}
                >
                    <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                    size="small"
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
