import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import type React from 'react';
import { useState } from 'react';
import type { DesiredState } from '../../../../types/my_way';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import { DesiredStateTypography } from '../../../../components/CustomTypography';
import useDesiredStateCategoryContext from '../../../../hooks/useDesiredStateCategoryContext';

interface DesiredStateDialogProps {
    onClose: () => void;
    desiredState?: DesiredState;
}

const NO_CATEGORY = 'NO_CATEGORY';

const DesiredStateDialog = ({ onClose, desiredState }: DesiredStateDialogProps) => {
    const [name, setName] = useState(desiredState ? desiredState.name : '');
    const [description, setDescription] = useState<string>(desiredState?.description ?? '');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(desiredState?.category_id ?? NO_CATEGORY);
    const [isFocused, setIsFocused] = useState(desiredState ? desiredState.is_focused : false);

    const { createDesiredState, updateDesiredState } = useDesiredStateContext();
    const { desiredStateCategories } = useDesiredStateCategoryContext();

    const handleSelectCategory = (event: SelectChangeEvent) => {
        setSelectedCategoryId(event.target.value);
    };

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        const categoryId = selectedCategoryId === NO_CATEGORY ? null : selectedCategoryId;
        if (desiredState === undefined) {
            createDesiredState(name, descriptionNullable, categoryId, isFocused);
        } else {
            updateDesiredState(desiredState.id, name, descriptionNullable, categoryId, isFocused);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogTitle>
                <DesiredStateTypography variant='h5' name={`そのために、：${desiredState === undefined ? '追加' : '編集'}`} />
            </DialogTitle>
            <DialogContent>
                <TextField value={name} onChange={event => setName(event.target.value)} label='Name' fullWidth sx={{ marginTop: 1 }} />
                <TextField
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    label='詳細'
                    multiline
                    fullWidth
                    minRows={5}
                    sx={{ marginTop: 1 }}
                />
                <Box>
                    <InputLabel id='desired-state-category-select' sx={{ mt: 1 }}>
                        カテゴリー
                    </InputLabel>
                    <Select id='desired-state-category-select' value={selectedCategoryId} onChange={handleSelectCategory}>
                        {desiredStateCategories?.map(category => {
                            return (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            );
                        })}
                        <MenuItem value={NO_CATEGORY}>なし</MenuItem>
                    </Select>
                </Box>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isFocused}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setIsFocused(event.target.checked);
                            }}
                        />
                    }
                    label='重点項目'
                />
                {desiredState === undefined && (
                    <Typography>
                        ＊大望を達成するために自分はどうあるべきなのか、そのために有用なことを書き出しましょう。カテゴリーを設定して区分することもできます。
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant='contained' onClick={handleSubmit}>
                        {desiredState === undefined ? '追加する' : '保存する'}
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default DesiredStateDialog;
