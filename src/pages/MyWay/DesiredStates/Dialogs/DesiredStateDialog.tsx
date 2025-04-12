import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import type { DesiredState } from '../../../../types/desired_state';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import { DesiredStateTypography } from '../../../../components/CustomTypography';

interface DesiredStateDialogProps {
    onClose: () => void;
    desiredState?: DesiredState;
}

const DesiredStateDialog = ({ onClose, desiredState }: DesiredStateDialogProps) => {
    const [name, setName] = useState(desiredState ? desiredState.name : '');
    const [description, setDescription] = useState<string>(desiredState?.description ?? '');

    const { createDesiredState, updateDesiredState } = useDesiredStateContext();

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (desiredState === undefined) {
            createDesiredState(name, descriptionNullable);
        } else {
            updateDesiredState(desiredState.id, name, descriptionNullable);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogTitle>
                <DesiredStateTypography variant='h5' name={`目指す姿：${desiredState === undefined ? '追加' : '編集'}`} />
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
