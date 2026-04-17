import { Button, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
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
interface Category {
    id: string | null;
    name: string;
    directions: Direction[];
}

const SortDirectionsDialog = ({ onClose }: SortDirectionsDialogProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { activeDirections: directionsMaster, bulkUpdateDirectionOrdering, getDirections } = useDirectionContext();
    const { directionCategories, getDirectionCategories, bulkUpdateDirectionCategoryOrdering } = useDirectionCategoryContext();

    const save = async () => {
        if (categories === undefined) return;
        const categoryIds = categories.map(category => category.id).filter(id => id !== null) as string[];
        bulkUpdateDirectionCategoryOrdering(categoryIds).then(_ => {
            bulkUpdateDirectionOrdering(
                categories
                    .map(category => category.directions)
                    .flat(1)
                    .map(direction => direction.id),
            ).then(_ => {
                getDirections();
                getDirectionCategories();
                onClose();
            });
        });
    };

    useEffect(() => {
        if (categories.length > 0 || directionCategories === undefined) return;
        if (directionsMaster === undefined || directionsMaster.length === 0) return;
        setCategories([
            ...directionCategories.map(category => {
                return { ...category, directions: directionsMaster.filter(direction => direction.category_id === category.id) };
            }),
            { id: null, name: 'カテゴリーなし', directions: directionsMaster.filter(direction => direction.category_id === null) },
        ]);
    }, [categories.length, directionCategories, directionsMaster]);

    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterText="指針：並び替え"
            content={
                <Grid container spacing={1}>
                    {categories
                        .filter(category => category.directions.length > 0 || category.id !== null)
                        .map((category, idx) => {
                            return (
                                <Grid size={12} key={category.id ?? 'NO_CATEGORY'}>
                                    <Paper elevation={2} sx={{ py: 0.5, px: 1, mb: 1, bgcolor: 'background.default' }}>
                                        <Stack direction="row">
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    ml: 0.5,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {category.name}
                                            </Typography>
                                            <div style={{ flexGrow: 1 }} />
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setCategories(prev => moveItemUp(prev, idx));
                                                }}
                                                disabled={category.id === null || idx === 0}
                                            >
                                                <ArrowUpwardIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setCategories(prev => moveItemDown(prev, idx));
                                                }}
                                                disabled={category.id === null || idx === categories.length - 2}
                                            >
                                                <ArrowDownwardIcon />
                                            </IconButton>
                                        </Stack>
                                        {category.directions.map((direction, idx) => {
                                            return (
                                                <SortItem
                                                    key={direction.id}
                                                    direction={direction}
                                                    idx={idx}
                                                    moveUp={() => {
                                                        setCategories(prev => {
                                                            const toBe = [...prev];
                                                            const categoryIdx = toBe.findIndex(item => item.id === category.id);
                                                            if (categoryIdx > -1) {
                                                                toBe[categoryIdx].directions = moveItemUp(toBe[categoryIdx].directions, idx);
                                                            }
                                                            return toBe;
                                                        });
                                                    }}
                                                    moveDown={() => {
                                                        setCategories(prev => {
                                                            const toBe = [...prev];
                                                            const categoryIdx = toBe.findIndex(item => item.id === category.id);
                                                            if (categoryIdx > -1) {
                                                                toBe[categoryIdx].directions = moveItemDown(toBe[categoryIdx].directions, idx);
                                                            }
                                                            return toBe;
                                                        });
                                                    }}
                                                    disableMoveUp={idx === 0}
                                                    disableMoveDown={idx === category.directions.length - 1}
                                                />
                                            );
                                        })}
                                    </Paper>
                                </Grid>
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
    moveUp,
    moveDown,
    disableMoveUp,
    disableMoveDown,
}: {
    direction: Direction;
    idx: number;
    moveUp: () => void;
    moveDown: () => void;
    disableMoveUp: boolean;
    disableMoveDown: boolean;
}) => {
    return (
        <Grid size={12}>
            <Paper elevation={2} sx={{ py: 0.5, pl: 1, mb: 1 }}>
                <Stack direction="row">
                    <Typography
                        variant="body1"
                        sx={{
                            ml: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: '2.1rem',
                        }}
                    >
                        {direction.name}
                    </Typography>
                    <div style={{ flexGrow: 1 }} />
                    <IconButton size="small" onClick={moveUp} disabled={disableMoveUp}>
                        <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton size="small" onClick={moveDown} disabled={disableMoveDown}>
                        <ArrowDownwardIcon />
                    </IconButton>
                </Stack>
            </Paper>
        </Grid>
    );
};

export default SortDirectionsDialog;
