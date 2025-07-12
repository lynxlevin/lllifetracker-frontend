import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { Diary, DiaryKey } from '../../../../types/diary';
import useDiaryContext from '../../../../hooks/useDiaryContext';
import type { Tag } from '../../../../types/tag';
import TagSelect from '../../../../components/TagSelect';

interface DiaryDialogProps {
    onClose: () => void;
    diary?: Diary;
}

const DiaryDialog = ({ onClose, diary }: DiaryDialogProps) => {
    const [text, setText] = useState(diary ? diary.text : null);
    const [date, setDate] = useState<Date>(diary ? new Date(diary.date) : new Date());
    const [tags, setTags] = useState<Tag[]>(diary ? diary.tags : []);

    const { createDiary, updateDiary } = useDiaryContext();

    const handleSubmit = () => {
        const textNullable = text === '' ? null : text;
        if (diary === undefined) {
            createDiary(
                textNullable,
                date,
                tags.map(tag => tag.id),
            );
        } else {
            const update_keys: DiaryKey[] = [];
            if (textNullable !== diary.text) update_keys.push('Text');
            if (date !== new Date(diary.date)) update_keys.push('Date');
            if (tags !== diary.tags) update_keys.push('TagIds');
            updateDiary(
                diary.id,
                textNullable,
                date,
                tags.map(tag => tag.id),
                update_keys,
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
                <br />
                <TagSelect tags={tags} setTags={setTags} />
                <TextField value={text ?? ''} onChange={event => setText(event.target.value)} label='内容' multiline fullWidth rows={10} />
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

export default DiaryDialog;
