import { Button, InputLabel, MenuItem, Select, type SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import type React from 'react';
import { useState } from 'react';
import type { Direction } from '../../../../types/my_way';
import useDirectionContext from '../../../../hooks/useDirectionContext';
import useDirectionCategoryContext from '../../../../hooks/useDirectionCategoryContext';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

interface DirectionDialogProps {
    onClose: () => void;
    direction?: Direction;
}

const NO_CATEGORY = 'NO_CATEGORY';

const DirectionDialog = ({ onClose, direction }: DirectionDialogProps) => {
    const [name, setName] = useState(direction ? direction.name : '');
    const [description, setDescription] = useState<string>(direction?.description ?? '');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(direction?.category_id ?? NO_CATEGORY);

    const { createDirection, updateDirection } = useDirectionContext();
    const { directionCategories } = useDirectionCategoryContext();

    const handleSelectCategory = (event: SelectChangeEvent) => {
        setSelectedCategoryId(event.target.value);
    };

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        const categoryId = selectedCategoryId === NO_CATEGORY ? null : selectedCategoryId;
        if (direction === undefined) {
            createDirection(name, descriptionNullable, categoryId);
        } else {
            updateDirection(direction.id, name, descriptionNullable, categoryId);
        }
        onClose();
    };

    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterContent={<Typography variant="h5">指針{direction === undefined ? '追加' : '編集'}</Typography>}
            content={
                <>
                    <Stack direction="row" alignItems="center">
                        <InputLabel id="direction-category-select" sx={{ mt: 1 }}>
                            カテゴリー
                        </InputLabel>
                        <Select id="direction-category-select" value={selectedCategoryId} onChange={handleSelectCategory}>
                            {directionCategories?.map(category => {
                                return (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                );
                            })}
                            <MenuItem value={NO_CATEGORY}>なし</MenuItem>
                        </Select>
                    </Stack>
                    <TextField value={name} onChange={event => setName(event.target.value)} label="Name" fullWidth sx={{ marginTop: 1 }} />
                    <TextField
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                        label="詳細"
                        multiline
                        fullWidth
                        minRows={5}
                        sx={{ marginTop: 1 }}
                    />
                    {direction === undefined && (
                        <Typography>
                            ＊大志を達成するために自分はどうあるべきなのか、そのために有用なことを書き出しましょう。カテゴリーを設定して区分することもできます。
                        </Typography>
                    )}
                </>
            }
            bottomPart={
                <>
                    <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {direction === undefined ? '追加する' : '保存する'}
                    </Button>
                </>
            }
            bgColor="white"
        />
    );
};

export default DirectionDialog;
