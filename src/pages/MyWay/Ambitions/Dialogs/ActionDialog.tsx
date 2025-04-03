import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import type { DesiredStateWithActions } from '../../../../types/desired_state';
import type { Action } from '../../../../types/action';
import { ActionTypography } from '../../../../components/CustomTypography';

interface ActionDialogProps {
    onClose: () => void;
    desiredState?: DesiredStateWithActions;
    action?: Action;
}

const ActionDialog = ({ onClose, desiredState, action }: ActionDialogProps) => {
    const [name, setName] = useState(action ? action.name : '');
    const [description, setDescription] = useState<string>(action?.description ?? '');

    const { addAction, updateAction } = useAmbitionContext();

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (desiredState !== undefined) {
            addAction(desiredState.id, name, descriptionNullable);
        } else if (action !== undefined) {
            updateAction(action.id, name, descriptionNullable);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogTitle>
                {desiredState !== undefined ? (
                    <>
                        <Typography variant='h5'>目指す姿：{desiredState.name}</Typography>
                        <Typography variant='h6'>活動を追加</Typography>
                    </>
                ) : (
                    <ActionTypography variant='h5' name='活動：編集' />
                )}
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
                        {desiredState !== undefined ? '追加する' : '保存する'}
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default ActionDialog;
