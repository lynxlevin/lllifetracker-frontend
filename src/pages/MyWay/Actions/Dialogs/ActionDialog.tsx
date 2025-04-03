import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import type { ActionWithLinks } from '../../../../types/action';
import useActionContext from '../../../../hooks/useActionContext';
import { ActionTypography } from '../../../../components/CustomTypography';

interface ActionDialogProps {
    onClose: () => void;
    action?: ActionWithLinks;
}

const ActionDialog = ({ onClose, action }: ActionDialogProps) => {
    const [name, setName] = useState(action ? action.name : '');
    const [description, setDescription] = useState<string>(action?.description ?? '');

    const { createAction, updateAction } = useActionContext();

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (action === undefined) {
            createAction(name, descriptionNullable);
        } else {
            updateAction(action.id, name, descriptionNullable);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogTitle>
                <ActionTypography variant='h5' name={`活動：${action === undefined ? '追加' : '編集'}`} />
            </DialogTitle>
            <DialogContent>
                <TextField value={name} onChange={event => setName(event.target.value)} label='内容' fullWidth sx={{ marginTop: 1 }} />
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
            <DialogActions sx={{ justifyContent: 'center' }}>
                <>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant='contained' onClick={handleSubmit}>
                        {action === undefined ? '追加する' : '保存する'}
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default ActionDialog;
