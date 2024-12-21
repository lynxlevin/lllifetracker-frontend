import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { Memo } from '../../../types/memo';
import useMemoContext from '../../../hooks/useMemoContext';
import type { Tag } from '../../../types/tag';
import TagSelect from '../../../components/TagSelect';

interface MemoDialogProps {
    onClose: () => void;
    memo?: Memo;
}

const MemoDialog = ({ onClose, memo }: MemoDialogProps) => {
    const [title, setTitle] = useState(memo ? memo.title : '');
    const [text, setText] = useState(memo ? memo.text : '');
    const [date, setDate] = useState<Date>(memo ? new Date(memo.date) : new Date());
    const [tags, setTags] = useState<Tag[]>(memo ? memo.tags : []);

    const { createMemo, updateMemo } = useMemoContext();

    const handleSubmit = () => {
        if (memo === undefined) {
            createMemo(
                title,
                text,
                date,
                tags.map(tag => tag.id),
            );
        } else {
            updateMemo(
                memo.id,
                title,
                text,
                date,
                tags.map(tag => tag.id),
            );
        }
        onClose();
    };

    const onChangeDate = (newDate: Date | null) => {
        if (newDate) {
            setDate(newDate);
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ pr: 0.5, pl: 0.5, pt: 2 }}>
                <MobileDatePicker label='日付' value={date} onChange={onChangeDate} showDaysOutsideCurrentMonth closeOnSelect sx={{ mb: 1 }} />
                <TagSelect tags={tags} setTags={setTags} />
                <TextField value={title} onChange={event => setTitle(event.target.value)} label='タイトル' multiline fullWidth minRows={1} sx={{ mb: 2 }} />
                <TextField value={text} onChange={event => setText(event.target.value)} label='内容' multiline fullWidth rows={8} />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button variant='contained' onClick={handleSubmit}>
                    保存
                </Button>
                <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MemoDialog;
