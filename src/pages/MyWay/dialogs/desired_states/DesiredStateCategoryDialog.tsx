import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { DesiredStateCategory } from '../../../../types/my_way';
import useDesiredStateCategoryContext from '../../../../hooks/useDesiredStateCategoryContext';

interface DesiredStateCategoryDialogProps {
    onClose: () => void;
    category?: DesiredStateCategory;
}

const DesiredStateCategoryDialog = ({ onClose, category }: DesiredStateCategoryDialogProps) => {
    const [name, setName] = useState(category ? category.name : '');

    const { createDesiredStateCategory, updateDesiredStateCategory } = useDesiredStateCategoryContext();

    const handleSubmit = () => {
        if (category === undefined) {
            createDesiredStateCategory(name);
        } else {
            updateDesiredStateCategory(category.id, name);
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

export default DesiredStateCategoryDialog;
