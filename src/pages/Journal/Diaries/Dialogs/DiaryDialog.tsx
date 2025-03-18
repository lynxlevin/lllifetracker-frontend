import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { Diary } from '../../../../types/diary';
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
    const [score, setScore] = useState(diary ? diary.score : null);
    const [tags, setTags] = useState<Tag[]>(diary ? diary.tags : []);

    const { createDiary, updateDiary } = useDiaryContext();

    const handleSubmit = () => {
        // MYMEMO: change to null if ""
        if (diary === undefined) {
            createDiary(
                text,
                date,
                score,
                tags.map(tag => tag.id),
            );
        } else {
            // const update_keys = [];
            updateDiary(
                diary.id,
                text,
                date,
                score,
                tags.map(tag => tag.id),
                [],
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
                <TextField value={score} onChange={event => setScore(Number(event.target.value))} type='number' label='点数' fullWidth />
                <TextField value={text} onChange={event => setText(event.target.value)} label='内容' multiline fullWidth rows={10} />
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
