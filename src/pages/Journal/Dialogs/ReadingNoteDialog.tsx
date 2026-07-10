import { Button, FormLabel, TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useEffect, useRef, useState } from 'react';
import type { Tag } from '../../../types/tag';
import type { ReadingNote } from '../../../types/journal';
import useReadingNoteAPI from '../../../hooks/useReadingNoteAPI';
import TagSelect from '../../../components/TagSelect';
import DialogWithAppBar from '../../../components/DialogWithAppBar';

interface ReadingNoteDialogProps {
    onClose: () => void;
    readingNote: ReadingNote;
}

interface ValidationErrorsType {
    pageNumber?: string;
}

const ReadingNoteDialog = ({ onClose, readingNote }: ReadingNoteDialogProps) => {
    const [title, setTitle] = useState(readingNote.title);
    const [pageNumber, setPageNumber] = useState<number | null>(readingNote.page_number);
    const [text, setText] = useState(readingNote.text);
    const [date, setDate] = useState<Date>(new Date(readingNote.date));
    const [tags, setTags] = useState<Tag[]>(readingNote.tags);
    const [tagSelectHeight, setTagSelectHeight] = useState(65);
    const [titleInputHeight, setTitleInputHeight] = useState(65);
    const titleInputRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (titleInputRef.current === null) return;
        setTitleInputHeight(titleInputRef.current.getBoundingClientRect().height);
    }, [title]);
    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterText="読書ノート：編集"
            content={
                <>
                    <MobileDatePicker label="日付" value={date} onChange={onChangeDate} showDaysOutsideCurrentMonth closeOnSelect sx={{ mb: 1 }} />
                    <TagSelect tags={tags} setTags={setTags} bubbleHeight={setTagSelectHeight} />
                    <TextField
                        ref={titleInputRef}
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                        label="タイトル"
                        multiline
                        fullWidth
                        minRows={1}
                        sx={{ my: 2 }}
                    />
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
                    />
                    <FormLabel sx={{ fontSize: '12px', ml: '14px' }}>内容</FormLabel>
                    <textarea
                        className="textarea-base"
                        value={text ?? ''}
                        onChange={event => setText(event.target.value)}
                        style={{ height: `calc(100svh - ${305 + tagSelectHeight + titleInputHeight}px)`, width: '100%', marginTop: '-3px' }}
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

export default ReadingNoteDialog;
