import { Button, FormLabel } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { Diary, DiaryKey } from '../../../types/journal';
import useDiaryAPI from '../../../hooks/useDiaryAPI';
import type { Tag } from '../../../types/tag';
import TagSelect from '../../../components/TagSelect';
import DialogWithAppBar from '../../../components/DialogWithAppBar';

interface DiaryDialogProps {
    onClose: () => void;
    diary: Diary;
}

const DiaryDialog = ({ onClose, diary }: DiaryDialogProps) => {
    const [text, setText] = useState(diary.text);
    const [date, setDate] = useState<Date>(new Date(diary.date));
    const [tags, setTags] = useState<Tag[]>(diary.tags);
    const [tagSelectHeight, setTagSelectHeight] = useState(65);

    const { updateDiary } = useDiaryAPI();

    const handleSubmit = () => {
        const textNullable = text === '' ? null : text;
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
        )
            .then(onClose)
            .catch(_ => {});
    };

    const onChangeDate = (newDate: Date | null) => {
        if (newDate) {
            setDate(newDate);
        }
    };

    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterText="日記：編集"
            content={
                <>
                    <MobileDatePicker label="日付" value={date} onChange={onChangeDate} showDaysOutsideCurrentMonth closeOnSelect sx={{ mb: 1 }} />
                    <br />
                    <TagSelect tags={tags} setTags={setTags} bubbleHeight={setTagSelectHeight} />
                    <FormLabel sx={{ fontSize: '12px', ml: '14px' }}>内容</FormLabel>
                    <textarea
                        className="textarea-base"
                        value={text ?? ''}
                        onChange={event => setText(event.target.value)}
                        style={{ height: `calc(100svh - ${225 + tagSelectHeight}px)`, width: '100%', marginTop: '-3px' }}
                    />
                </>
            }
            bottomPart={
                <>
                    <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        保存
                    </Button>
                </>
            }
            bgColor="white"
        />
    );
};

export default DiaryDialog;
