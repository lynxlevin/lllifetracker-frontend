import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { DesiredState, DesiredStateCategory } from '../../../../types/my_way';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import { DesiredStateTypography } from '../../../../components/CustomTypography';
import useDesiredStateCategoryContext from '../../../../hooks/useDesiredStateCategoryContext';

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
            createDesiredState(name, descriptionNullable, null);
        } else {
            updateDesiredState(desiredState.id, name, descriptionNullable, null);
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
                {desiredState === undefined ? (
                    <Typography>＊大望を達成するために自分はどうあるべきなのか、まだ辿り着けていない目指す姿を書きましょう。</Typography>
                ) : (
                    <Typography>＊もうこの「目指す姿」が必要なくなったと感じたら、アーカイブするか「心掛け」に変換しましょう。</Typography>
                )}
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
