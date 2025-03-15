import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import type { AmbitionWithLinks } from '../../../../types/ambition';
import { AmbitionTypography } from '../../../../components/CustomTypography';

interface AmbitionDialogProps {
    onClose: () => void;
    ambition?: AmbitionWithLinks;
}

const AmbitionDialog = ({ onClose, ambition }: AmbitionDialogProps) => {
    const [name, setName] = useState(ambition ? ambition.name : '');
    const [description, setDescription] = useState<string>(ambition?.description ?? '');

    const { createAmbition, updateAmbition } = useAmbitionContext();

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (ambition === undefined) {
            createAmbition(name, descriptionNullable);
        } else {
            updateAmbition(ambition.id, name, descriptionNullable);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogTitle>
                <AmbitionTypography variant='h5' iconSize='medium' name={`大望：${ambition === undefined ? '追加' : '編集'}`} />
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
                        {ambition === undefined ? '追加する' : '保存する'}
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default AmbitionDialog;
