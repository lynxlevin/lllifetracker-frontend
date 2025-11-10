import { memo, useState } from 'react';
import { DiaryViewDialog } from './Diaries/Diary';
import type { Journal as JournalType } from '../../types/journal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ReadingNoteViewDialog } from './ReadingNotes/ReadingNote';
import { ThinkingNoteViewDialog } from './ThinkingNotes/ThinkingNote';
import useTagContext from '../../hooks/useTagContext';
import { Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { format } from 'date-fns';

interface JournalProps {
    journal: JournalType;
}

type DialogType = 'View';
export type JournalKind = 'Diary' | 'ReadingNote' | 'ThinkingNote';

const Journal = ({ journal }: JournalProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { getTagColor } = useTagContext();

    const journalKind: JournalKind = journal.diary !== null ? 'Diary' : journal.reading_note !== null ? 'ReadingNote' : 'ThinkingNote';

    const status =
        journal.thinking_note === null
            ? undefined
            : journal.thinking_note.resolved_at === null
              ? journal.thinking_note.archived_at === null
                  ? 'active'
                  : 'archived'
              : 'resolved';

    const getDialog = () => {
        switch (journalKind) {
            case 'Diary':
                switch (openedDialog) {
                    case 'View':
                        return <DiaryViewDialog diary={journal.diary!} onClose={() => setOpenedDialog(undefined)} />;
                }
                break;
            case 'ReadingNote':
                switch (openedDialog) {
                    case 'View':
                        return <ReadingNoteViewDialog onClose={() => setOpenedDialog(undefined)} readingNote={journal.reading_note!} />;
                }
                break;
            case 'ThinkingNote':
                switch (openedDialog) {
                    case 'View':
                        return <ThinkingNoteViewDialog onClose={() => setOpenedDialog(undefined)} thinkingNote={journal.thinking_note!} status={status!} />;
                }
        }
    };

    const getContent = () => {
        switch (journalKind) {
            case 'Diary':
                return (
                    <>
                        <Typography fontSize="1.15rem">{format(journal.diary!.date, 'yyyy-MM-dd E')}</Typography>
                        {journal.diary!.tags.length > 0 && (
                            <Stack direction="row" mt={0.5} flexWrap="wrap" gap={0.5}>
                                {journal.diary!.tags.map(tag => (
                                    <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                                ))}
                            </Stack>
                        )}
                        <div className="line-clamp" style={{ marginTop: '0.5rem' }}>
                            {journal.diary!.text}
                        </div>
                    </>
                );
            case 'ReadingNote':
                return (
                    <>
                        <Typography fontSize="1.15rem">
                            {journal.reading_note!.title}({journal.reading_note!.page_number})
                        </Typography>
                        {journal.reading_note!.tags.length > 0 && (
                            <Stack direction="row" mt={0.5} flexWrap="wrap" gap={0.5}>
                                {journal.reading_note!.tags.map(tag => (
                                    <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                                ))}
                            </Stack>
                        )}
                        <div className="line-clamp" style={{ marginTop: '0.5rem' }}>
                            {journal.reading_note!.text}
                        </div>
                    </>
                );
            case 'ThinkingNote':
                return (
                    <>
                        {status === 'resolved' && <CheckCircleIcon sx={{ position: 'absolute', top: 2, left: 2, color: green['A700'], fontSize: '1.25rem' }} />}
                        <Typography fontSize="1.15rem">{journal.thinking_note!.question}</Typography>
                        {journal.thinking_note!.answer && (
                            <Typography fontSize="1.15rem" ml={3}>
                                →{journal.thinking_note!.answer}
                            </Typography>
                        )}
                        {journal.thinking_note!.tags.length > 0 && (
                            <Stack direction="row" mt={0.5} flexWrap="wrap" gap={0.5}>
                                {journal.thinking_note!.tags.map(tag => (
                                    <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                                ))}
                            </Stack>
                        )}
                        <div className="line-clamp" style={{ marginTop: '0.5rem' }}>
                            {journal.thinking_note!.thought}
                        </div>
                    </>
                );
        }
    };

    return (
        <Grid size={12} sx={{ textAlign: 'left' }}>
            <Card onClick={() => setOpenedDialog('View')}>
                <CardContent sx={{ position: 'relative' }}>{getContent()}</CardContent>
                {journalKind === 'ThinkingNote' && ['resolved', 'archived'].includes(status!) && (
                    <Typography textAlign="right" fontSize="0.7rem" mr={1} mb={1}>
                        {status === 'resolved' && `解決：${format(new Date(journal.thinking_note!.resolved_at!), 'yyyy年MM月dd日')}`}
                        {status === 'archived' && `アーカイブ：${format(new Date(journal.thinking_note!.archived_at!), 'yyyy年MM月dd日')}`}
                    </Typography>
                )}
            </Card>
            {openedDialog && getDialog()}
        </Grid>
    );
};

export default memo(Journal);
