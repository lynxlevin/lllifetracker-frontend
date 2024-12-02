import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { Memo } from '../../types/memo';
import useMemoContext from '../../hooks/useMemoContext';

interface EditMemoDialogProps {
    onClose: () => void;
    memo: Memo;
}

const EditMemoDialog = ({ onClose, memo }: EditMemoDialogProps) => {
    const [title, setTitle] = useState(memo.title);
    const [text, setText] = useState(memo.text);
    const [date, setDate] = useState<Date>(new Date(memo.date));

    const { updateMemo } = useMemoContext();

    const handleSubmit = () => {
        updateMemo(
            memo.id,
            title,
            text,
            date,
            memo.tags.map(tag => tag.id),
        );
        onClose();
    };

    const onChangeDate = (newDate: Date | null) => {
        if (newDate) {
            setDate(newDate);
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <MobileDatePicker label='日付' value={date} onChange={onChangeDate} showDaysOutsideCurrentMonth closeOnSelect sx={{ mb: 1 }} />
                <TextField value={title} onChange={event => setTitle(event.target.value)} label='タイトル' multiline fullWidth minRows={1} sx={{ mb: 2 }} />
                <TextField value={text} onChange={event => setText(event.target.value)} label='内容' multiline fullWidth minRows={5} />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', py: 2 }}>
                <Button variant='contained' onClick={handleSubmit}>
                    修正する
                </Button>
                <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditMemoDialog;
