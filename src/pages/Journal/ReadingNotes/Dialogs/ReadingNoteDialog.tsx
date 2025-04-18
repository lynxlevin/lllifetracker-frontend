import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { Tag } from '../../../../types/tag';
import type { ReadingNote } from '../../../../types/reading_note';
import useReadingNoteContext from '../../../../hooks/useReadingNoteContext';
import TagSelect from '../../../../components/TagSelect';

interface ReadingNoteDialogProps {
    onClose: () => void;
    readingNote?: ReadingNote;
}

interface ValidationErrorsType {
    pageNumber?: string;
}

const ReadingNoteDialog = ({ onClose, readingNote }: ReadingNoteDialogProps) => {
    const [title, setTitle] = useState(readingNote ? readingNote.title : '');
    const [pageNumber, setPageNumber] = useState(readingNote ? readingNote.page_number : null);
    const [text, setText] = useState(readingNote ? readingNote.text : '');
    const [date, setDate] = useState<Date>(readingNote ? new Date(readingNote.date) : new Date());
    const [tags, setTags] = useState<Tag[]>(readingNote ? readingNote.tags : []);

    const [validationErrors, setValidationErrors] = useState<ValidationErrorsType>({});

    const { createReadingNote, updateReadingNote } = useReadingNoteContext();

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
        if (readingNote === undefined) {
            createReadingNote(
                title,
                pageNumber!,
                text,
                date,
                tags.map(tag => tag.id),
            );
        } else {
            updateReadingNote(
                readingNote.id,
                title,
                pageNumber!,
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
                <TextField
                    label='ページ'
                    value={pageNumber}
                    type='number'
                    error={Boolean(validationErrors.pageNumber)}
                    helperText={validationErrors.pageNumber ?? ''}
                    onChange={event => {
                        const value = event.target.value === '' ? null : Number(event.target.value);
                        if (validationErrors.pageNumber) removeValidationError('pageNumber');
                        setPageNumber(value);
                    }}
                    variant='standard'
                    fullWidth
                    sx={{ mb: 2 }}
                />
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

export default ReadingNoteDialog;
