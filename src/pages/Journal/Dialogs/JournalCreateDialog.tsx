import { Autocomplete, Box, Button, Dialog, DialogContent, Stack, Tab, Tabs, TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import type { Tag } from '../../../types/tag';
import TagSelect from '../../../components/TagSelect';
import DialogWithAppBar from '../../../components/DialogWithAppBar';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import AbsoluteButton from '../../../components/AbsoluteButton';
import useDiaryAPI from '../../../hooks/useDiaryAPI';
import useReadingNoteAPI from '../../../hooks/useReadingNoteAPI';
import useThinkingNoteAPI from '../../../hooks/useThinkingNoteAPI';
import type { JournalKind } from '../../../types/journal';
import { ReadingNoteAPI } from '../../../apis/ReadingNoteAPI';

interface JournalCreateDialogProps {
    onClose: () => void;
    defaultTags?: Tag[];
}

type DialogType = 'Focus';

const JournalCreateDialog = ({ onClose, defaultTags = [] }: JournalCreateDialogProps) => {
    const [kind, setKind] = useState<JournalKind>('Diary');
    // Common
    const [textOrThought, setTextOrThought] = useState('');
    const [tags, setTags] = useState<Tag[]>(defaultTags);
    // Diary + ReadingNote
    const [date, setDate] = useState(new Date());
    // ReadingNote
    const [title, setTitle] = useState('');
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [titleCandidates, setTitleCandidates] = useState<string[]>();
    // ThinkingNote
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { createDiary } = useDiaryAPI();
    const { createReadingNote } = useReadingNoteAPI();
    const { createThinkingNote } = useThinkingNoteAPI();

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
                        <Autocomplete
                            options={titleCandidates ?? []}
                            freeSolo
                            value={title}
                            renderInput={params => <TextField {...params} label="タイトル" />}
                            onInputChange={(_, newValue: string | null) => {
                                if (newValue) {
                                    setTitle(newValue);
                                }
                            }}
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

    useEffect(() => {
        if (kind !== 'ReadingNote') return;
        if (titleCandidates !== undefined) return;
        ReadingNoteAPI.listTitles().then(res => {
            setTitleCandidates(res.data);
        });
    }, [kind, titleCandidates]);

    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterText="日誌: 追加"
            content={
                <>
                    <Stack direction="row" alignItems="center" mb={1}>
                        <Tabs
                            value={kind}
                            onChange={(_, newValue: string | null) => {
                                setKind(newValue as JournalKind);
                            }}
                            variant="scrollable"
                        >
                            <Tab value="Diary" label="日記" />
                            <Tab value="ThinkingNote" label="思索ノート" />
                            <Tab value="ReadingNote" label="読書ノート" />
                        </Tabs>
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
