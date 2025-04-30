import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import useMindsetContext from '../../../../hooks/useMindsetContext';
import type { Mindset } from '../../../../types/my_way';
import { MindsetTypography } from '../../../../components/CustomTypography';

interface MindsetDialogProps {
    onClose: () => void;
    mindset?: Mindset;
}

const MindsetDialog = ({ onClose, mindset }: MindsetDialogProps) => {
    const [name, setName] = useState(mindset ? mindset.name : '');
    const [description, setDescription] = useState<string>(mindset?.description ?? '');

    const { createMindset, updateMindset } = useMindsetContext();

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (mindset === undefined) {
            createMindset(name, descriptionNullable);
        } else {
            updateMindset(mindset.id, name, descriptionNullable);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogTitle>
                <MindsetTypography variant='h5' iconSize='medium' name={`心掛け：${mindset === undefined ? '追加' : '編集'}`} />
            </DialogTitle>
            <DialogContent>
                <TextField value={name} onChange={event => setName(event.target.value)} label='内容' fullWidth />
                <TextField
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    label='詳細'
                    multiline
                    fullWidth
                    minRows={5}
                    sx={{ marginTop: 1 }}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant='contained' onClick={handleSubmit}>
                        {mindset === undefined ? '追加する' : '保存する'}
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default MindsetDialog;
