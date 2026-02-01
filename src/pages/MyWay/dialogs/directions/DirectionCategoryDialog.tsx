import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { DirectionCategory } from '../../../../types/my_way';
import useDirectionCategoryContext from '../../../../hooks/useDirectionCategoryContext';

interface DirectionCategoryDialogProps {
    onClose: () => void;
    category?: DirectionCategory;
}

const DirectionCategoryDialog = ({ onClose, category }: DirectionCategoryDialogProps) => {
    const [name, setName] = useState(category ? category.name : '');

    const { createDirectionCategory, updateDirectionCategory } = useDirectionCategoryContext();

    const handleSubmit = () => {
        if (category === undefined) {
            createDirectionCategory(name);
        } else {
            updateDirectionCategory(category.id, name);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogTitle>
                <Typography variant="h5">大事にすることカテゴリー：{category === undefined ? '追加' : '編集'}</Typography>
            </DialogTitle>
            <DialogContent>
                <TextField value={name} onChange={event => setName(event.target.value)} label="Name" fullWidth sx={{ marginTop: 1 }} />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <>
                    <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {category === undefined ? '追加する' : '保存する'}
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default DirectionCategoryDialog;
