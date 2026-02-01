import { Box, Button, Card, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import useDirectionContext from '../../../../hooks/useDirectionContext';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { moveItemDown, moveItemUp } from '../../../../hooks/useArraySort';
import type { Direction } from '../../../../types/my_way';
import useDirectionCategoryContext from '../../../../hooks/useDirectionCategoryContext';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

interface SortDirectionsDialogProps {
    onClose: () => void;
}

const SortDirectionsDialog = ({ onClose }: SortDirectionsDialogProps) => {
    const [directionIds, setDirectionIds] = useState<string[]>([]);
    const { directions: directionsMaster, bulkUpdateDirectionOrdering, getDirections } = useDirectionContext();
    const { categoryMap, cmpDirectionsByCategory } = useDirectionCategoryContext();

    const directionMap = useMemo(() => {
        const map = new Map<string, Direction>();
        if (directionsMaster === undefined) return map;
        for (const master of directionsMaster) {
            map.set(master.id, master);
        }
        return map;
    }, [directionsMaster]);

    const save = async () => {
        if (directionIds === undefined) return;
        bulkUpdateDirectionOrdering(directionIds).then(_ => {
            getDirections();
            onClose();
        });
    };

    useEffect(() => {
        if (directionIds.length === 0 && directionsMaster !== undefined && directionsMaster.length > 0) {
            setDirectionIds(directionsMaster.map(direction => direction.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [directionsMaster]);

    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterContent={<Typography variant="h6">大事にすること：並び替え</Typography>}
            content={
                <Grid container spacing={1}>
                    {directionIds
                        ?.sort((a, b) => {
                            const directionA = directionMap.get(a)!;
                            const directionB = directionMap.get(b)!;
                            return cmpDirectionsByCategory(directionA, directionB);
                        })
                        .map((id: string, idx) => {
                            const direction = directionMap.get(id)!;
                            const isFirstOfCategory = idx === 0 || directionMap.get(directionIds[idx - 1])!.category_id !== direction.category_id;
                            const isLastOfCategory =
                                idx === directionIds.length - 1 || directionMap.get(directionIds[idx + 1])!.category_id !== direction.category_id;
                            return (
                                <Box key={id} width="100%">
                                    {isFirstOfCategory && (
                                        <Typography>
                                            {direction.category_id === null ? 'カテゴリーなし' : categoryMap.get(direction.category_id)?.name}
                                        </Typography>
                                    )}
                                    <SortItem
                                        direction={direction}
                                        idx={idx}
                                        directionIdsLength={directionIds.length}
                                        setDirectionIds={setDirectionIds}
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
    direction,
    idx,
    directionIdsLength,
    setDirectionIds,
    disableMoveUp,
    disableMoveDown,
}: {
    direction: Direction;
    idx: number;
    directionIdsLength: number;
    setDirectionIds: (value: React.SetStateAction<string[]>) => void;
    disableMoveUp: boolean;
    disableMoveDown: boolean;
}) => {
    const handleUp = (idx: number) => {
        if (idx === 0) return;
        setDirectionIds(prev => moveItemUp(prev, idx));
    };

    const handleDown = (idx: number) => {
        if (idx === directionIdsLength - 1) return;
        setDirectionIds(prev => moveItemDown(prev, idx));
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
                            {direction.name}
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

export default SortDirectionsDialog;
