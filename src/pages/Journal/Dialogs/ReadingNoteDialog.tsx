import { Box, Button, Dialog, DialogContent, TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { Tag } from '../../../types/tag';
import type { ReadingNote } from '../../../types/journal';
import useReadingNoteAPI from '../../../hooks/useReadingNoteAPI';
import TagSelect from '../../../components/TagSelect';
import DialogWithAppBar from '../../../components/DialogWithAppBar';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import AbsoluteButton from '../../../components/AbsoluteButton';

interface ReadingNoteDialogProps {
    onClose: () => void;
    readingNote: ReadingNote;
}

interface ValidationErrorsType {
    pageNumber?: string;
}

type DialogType = 'Focus';

const ReadingNoteDialog = ({ onClose, readingNote }: ReadingNoteDialogProps) => {
    const [title, setTitle] = useState(readingNote.title);
    const [pageNumber, setPageNumber] = useState<number | null>(readingNote.page_number);
    const [text, setText] = useState(readingNote.text);
    const [date, setDate] = useState<Date>(new Date(readingNote.date));
    const [tags, setTags] = useState<Tag[]>(readingNote.tags);

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [validationErrors, setValidationErrors] = useState<ValidationErrorsType>({});

    const { updateReadingNote } = useReadingNoteAPI();

    const addValidationError = (error: ValidationErrorsType) => {
        setValidationErrors(current => {
            return { ...current, ...error };
        });
    };

    const removeValidationError = (key: keyof ValidationErrorsType) => {
        setValidationErrors(current => {
            delete current[key];
            return current;
        });
    };

    const validInput = (): boolean => {
        let isValid = true;
        if (Object.keys(validationErrors).length > 0) isValid = false;
        if (pageNumber === null) {
            addValidationError({ pageNumber: 'Page number cannot be empty.' });
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = () => {
        if (!validInput()) return;
        updateReadingNote(
            readingNote.id,
            title,
            pageNumber!,
            text,
            date,
            tags.map(tag => tag.id),
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
            appBarCenterText="読書ノート：編集"
            content={
                <>
                    <MobileDatePicker label="日付" value={date} onChange={onChangeDate} showDaysOutsideCurrentMonth closeOnSelect sx={{ mb: 1 }} />
                    <TagSelect tags={tags} setTags={setTags} />
                    <TextField value={title} onChange={event => setTitle(event.target.value)} label="タイトル" multiline fullWidth minRows={1} sx={{ mb: 2 }} />
                    <TextField
                        label="ページ"
                        value={pageNumber}
                        type="number"
                        error={Boolean(validationErrors.pageNumber)}
                        helperText={validationErrors.pageNumber ?? ''}
                        onChange={event => {
                            const value = event.target.value === '' ? null : Number(event.target.value);
                            if (validationErrors.pageNumber) removeValidationError('pageNumber');
                            setPageNumber(value);
                        }}
                        variant="standard"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        value={text}
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

export default ReadingNoteDialog;
