import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import type { AmbitionWithLinks } from '../../../../types/ambition';
import type { DesiredStateWithActions } from '../../../../types/desired_state';
import { DesiredStateTypography } from '../../../../components/CustomTypography';

interface DesiredStateDialogProps {
    onClose: () => void;
    ambition?: AmbitionWithLinks;
    desiredState?: DesiredStateWithActions;
}

const DesiredStateDialog = ({ onClose, ambition, desiredState }: DesiredStateDialogProps) => {
    const [name, setName] = useState(desiredState ? desiredState.name : '');
    const [description, setDescription] = useState<string>(desiredState?.description ?? '');

    const { addDesiredState, updateDesiredState } = useAmbitionContext();

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (ambition !== undefined) {
            addDesiredState(ambition.id, name, descriptionNullable);
        } else if (desiredState !== undefined) {
            updateDesiredState(desiredState.id, name, descriptionNullable);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogTitle>
                {ambition !== undefined ? (
                    <>
                        <Typography variant='h5'>大望：{ambition.name}</Typography>
                        <Typography variant='h6'>目指す姿を追加</Typography>
                    </>
                ) : (
                    <DesiredStateTypography variant='h5' name='目指す姿：編集' />
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
                        {desiredState === undefined ? '追加する' : '保存する'}
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default DesiredStateDialog;
