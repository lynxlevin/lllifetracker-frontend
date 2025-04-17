import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useState } from 'react';
import type { Tag } from '../../../types/tag';
import useTagContext from '../../../hooks/useTagContext';

interface TagDialogProps {
    onClose: () => void;
    tag?: Tag;
}

const TagDialog = ({ onClose, tag }: TagDialogProps) => {
    const [name, setName] = useState(tag ? tag.name : null);

    const { createTag, updateTag } = useTagContext();

    const handleSubmit = () => {
        if (!name) return;
        if (tag === undefined) {
            createTag(name);
        } else {
            updateTag(tag.id, name);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ pr: 0.5, pl: 0.5, pt: 2 }}>
                <TextField defaultValue={name ?? ''} onBlur={event => setName(event.target.value)} label='名前' fullWidth />
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant='contained' onClick={handleSubmit}>
                        保存
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default TagDialog;
