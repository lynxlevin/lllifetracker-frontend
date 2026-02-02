import { Box, Button, Dialog, DialogContent, TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { Diary, DiaryKey } from '../../../types/journal';
import useDiaryAPI from '../../../hooks/useDiaryAPI';
import type { Tag } from '../../../types/tag';
import TagSelect from '../../../components/TagSelect';
import DialogWithAppBar from '../../../components/DialogWithAppBar';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import AbsoluteButton from '../../../components/AbsoluteButton';

interface DiaryDialogProps {
    onClose: () => void;
    diary: Diary;
}

type DialogType = 'Focus';

const DiaryDialog = ({ onClose, diary }: DiaryDialogProps) => {
    const [text, setText] = useState(diary.text);
    const [date, setDate] = useState<Date>(new Date(diary.date));
    const [tags, setTags] = useState<Tag[]>(diary.tags);

    const [openedDialog, setOpenedDialog] = useState<DialogType>();

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
        );
        onClose();
    };

    const onChangeDate = (newDate: Date | null) => {
        if (newDate) {
            setDate(newDate);
        }
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Focus':
                return (
                    <Dialog open onClose={onClose} fullScreen>
                        <DialogContent sx={{ padding: 2 }}>
                            <Box>
                                <TextField value={text} onChange={event => setText(event.target.value)} label="考察" multiline fullWidth minRows={10} />
                            </Box>
                            <AbsoluteButton onClick={() => setOpenedDialog(undefined)} bottom={10} right={25} size="small" icon={<CloseFullscreenIcon />} />
                        </DialogContent>
                    </Dialog>
                );
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
                    <TagSelect tags={tags} setTags={setTags} />
                    <TextField
                        value={text ?? ''}
                        onChange={event => setText(event.target.value)}
                        label="内容"
                        multiline
                        fullWidth
                        rows={8}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <AbsoluteButton onClick={() => setOpenedDialog('Focus')} bottom={5} right={5} size="small" icon={<FullscreenIcon />} />
                                ),
                            },
                        }}
                    />
                    {openedDialog && getDialog()}
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
