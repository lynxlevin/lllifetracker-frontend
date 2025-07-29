import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import type React from 'react';
import { useState } from 'react';
import type { DesiredState } from '../../../../types/my_way';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import { DesiredStateTypography } from '../../../../components/CustomTypography';
import useDesiredStateCategoryContext from '../../../../hooks/useDesiredStateCategoryContext';

interface DefaultParams {
    categoryId?: string;
}

interface DesiredStateDialogProps {
    onClose: () => void;
    desiredState?: DesiredState;
    defaultParams?: DefaultParams;
}

const NO_CATEGORY = 'NO_CATEGORY';

const DesiredStateDialog = ({ onClose, desiredState, defaultParams }: DesiredStateDialogProps) => {
    const [name, setName] = useState(desiredState ? desiredState.name : '');
    const [description, setDescription] = useState<string>(desiredState?.description ?? '');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(desiredState?.category_id ?? defaultParams?.categoryId ?? NO_CATEGORY);

    const { createDesiredState, updateDesiredState } = useDesiredStateContext();
    const { desiredStateCategories } = useDesiredStateCategoryContext();

    const handleSelectCategory = (event: SelectChangeEvent) => {
        setSelectedCategoryId(event.target.value);
    };

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        const categoryId = selectedCategoryId === NO_CATEGORY ? null : selectedCategoryId;
        if (desiredState === undefined) {
            createDesiredState(name, descriptionNullable, categoryId, false);
        } else {
            updateDesiredState(desiredState.id, name, descriptionNullable, categoryId, desiredState.is_focused);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogTitle>
                <DesiredStateTypography variant="h5" name={`マイルストーン：${desiredState === undefined ? '追加' : '編集'}`} />
            </DialogTitle>
            <DialogContent>
                <Stack direction="row" alignItems="center">
                    <InputLabel id="desired-state-category-select" sx={{ mt: 1 }}>
                        カテゴリー
                    </InputLabel>
                    <Select id="desired-state-category-select" value={selectedCategoryId} onChange={handleSelectCategory}>
                        {desiredStateCategories?.map(category => {
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
                {desiredState === undefined && (
                    <Typography>
                        ＊大志を達成するために自分はどうあるべきなのか、そのために有用なことを書き出しましょう。カテゴリーを設定して区分することもできます。
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <>
                    <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {desiredState === undefined ? '追加する' : '保存する'}
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default DesiredStateDialog;
