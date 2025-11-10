import { Box, Button, Dialog, DialogContent, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { Tag } from '../../types/tag';
import TagSelect from '../../components/TagSelect';
import DialogWithAppBar from '../../components/DialogWithAppBar';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import AbsoluteButton from '../../components/AbsoluteButton';
import { JournalKind } from './Journal';
import useDiaryContext from '../../hooks/useDiaryContext';
import useReadingNoteContext from '../../hooks/useReadingNoteContext';
import useThinkingNoteContext from '../../hooks/useThinkingNoteContext';

interface JournalCreateDialogProps {
    onClose: () => void;
}

type DialogType = 'Focus';

const JournalCreateDialog = ({ onClose }: JournalCreateDialogProps) => {
    const [kind, setKind] = useState<JournalKind>('Diary');
    // Common
    const [textOrThought, setTextOrThought] = useState('');
    const [tags, setTags] = useState<Tag[]>([]);
    // Diary + ReadingNote
    const [date, setDate] = useState(new Date());
    // ReadingNote
    const [title, setTitle] = useState('');
    const [pageNumber, setPageNumber] = useState<number | null>(null);
    // ThinkingNote
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { createDiary } = useDiaryContext();
    const { createReadingNote } = useReadingNoteContext();
    const { createThinkingNote } = useThinkingNoteContext();

    const handleSubmit = () => {
        const tagIds = tags.map(tag => tag.id);
        switch (kind) {
            case 'Diary':
                createDiary(textOrThought, date, tagIds);
                break;
            case 'ReadingNote':
                createReadingNote(title, pageNumber!, textOrThought, date, tagIds);
                break;
            case 'ThinkingNote':
                createThinkingNote({
                    question,
                    thought: textOrThought,
                    answer,
                    tag_ids: tagIds,
                });
                break;
        }
        // const textNullable = text === '' ? null : text;
        // if (diary === undefined) {
        //     createDiary(
        //         textNullable,
        //         date,
        //         tags.map(tag => tag.id),
        //     );
        // } else {
        //     const update_keys: DiaryKey[] = [];
        //     if (textNullable !== diary.text) update_keys.push('Text');
        //     if (date !== new Date(diary.date)) update_keys.push('Date');
        //     if (tags !== diary.tags) update_keys.push('TagIds');
        //     updateDiary(
        //         diary.id,
        //         textNullable,
        //         date,
        //         tags.map(tag => tag.id),
        //         update_keys,
        //     );
        // }
        onClose();
    };

    const onChangeDate = (newDate: Date | null) => {
        if (newDate) {
            setDate(newDate);
        }
    };

    const getFormInputs = () => {
        switch (kind) {
            case 'Diary':
                return (
                    <>
                        <MobileDatePicker label="日付" value={date} onChange={onChangeDate} showDaysOutsideCurrentMonth closeOnSelect sx={{ mb: 1 }} />
                        <TextField
                            value={textOrThought}
                            onChange={event => setTextOrThought(event.target.value)}
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
                    </>
                );
            case 'ReadingNote':
                return (
                    <>
                        <MobileDatePicker label="日付" value={date} onChange={onChangeDate} showDaysOutsideCurrentMonth closeOnSelect sx={{ mb: 1 }} />
                        <TextField
                            value={title}
                            onChange={event => setTitle(event.target.value)}
                            label="タイトル"
                            multiline
                            fullWidth
                            minRows={1}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="ページ"
                            value={pageNumber}
                            type="number"
                            onChange={event => {
                                const value = event.target.value === '' ? 0 : Number(event.target.value);
                                setPageNumber(value);
                            }}
                            variant="standard"
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            value={textOrThought}
                            onChange={event => setTextOrThought(event.target.value)}
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
                    </>
                );
            case 'ThinkingNote':
                return (
                    <>
                        <TextField
                            value={question}
                            onChange={event => setQuestion(event.target.value)}
                            label="課題"
                            multiline
                            fullWidth
                            minRows={1}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            value={textOrThought}
                            onChange={event => setTextOrThought(event.target.value)}
                            label="考察"
                            multiline
                            fullWidth
                            rows={8}
                            sx={{ mb: 2 }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <AbsoluteButton onClick={() => setOpenedDialog('Focus')} bottom={5} right={5} size="small" icon={<FullscreenIcon />} />
                                    ),
                                },
                            }}
                        />
                        <TextField
                            value={answer}
                            onChange={event => setAnswer(event.target.value)}
                            label="答え"
                            multiline
                            fullWidth
                            minRows={1}
                            sx={{ mb: 2 }}
                        />
                    </>
                );
        }
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Focus':
                return (
                    <Dialog open onClose={onClose} fullScreen>
                        <DialogContent sx={{ padding: 2 }}>
                            <Box>
                                <TextField
                                    value={textOrThought}
                                    onChange={event => setTextOrThought(event.target.value)}
                                    label={kind === 'ThinkingNote' ? '考察' : '内容'}
                                    multiline
                                    fullWidth
                                    minRows={10}
                                />
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
            appBarCenterContent={<Typography variant="h5">手記: 追加</Typography>}
            content={
                <>
                    <Stack direction="row" alignItems="center" mb={1}>
                        <InputLabel id="create-journal-kind-select">手記の種類</InputLabel>
                        <Select
                            id="create-journal-kind-select"
                            value={kind}
                            onChange={(event: SelectChangeEvent) => setKind(event.target.value as JournalKind)}
                        >
                            <MenuItem value="Diary">日記</MenuItem>
                            <MenuItem value="ThinkingNote">思索ノート</MenuItem>
                            <MenuItem value="ReadingNote">読書ノート</MenuItem>
                        </Select>
                    </Stack>
                    <TagSelect tags={tags} setTags={setTags} />
                    {getFormInputs()}
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

export default JournalCreateDialog;
