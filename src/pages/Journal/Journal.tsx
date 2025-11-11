import { memo, useState } from 'react';
import { DiaryViewDialog } from './Dialogs/DiaryViewDialog';
import type { Journal as JournalType } from '../../types/journal';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ReadingNoteViewDialog } from './Dialogs/ReadingNoteViewDialog';
import { ThinkingNoteViewDialog } from './Dialogs/ThinkingNoteViewDialog';
import useTagContext from '../../hooks/useTagContext';
import { Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { format } from 'date-fns';
import { Tag } from '../../types/tag';

interface JournalProps {
    journal: JournalType;
    shouldShowDate?: boolean;
    isFromJournals?: boolean;
}

type DialogType = 'View';

const Journal = ({ journal, shouldShowDate = false, isFromJournals = false }: JournalProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { getTagColor } = useTagContext();

    const status = journal.kind !== 'ThinkingNote' ? undefined : journal.thinking_note!.resolved_at === null ? 'active' : 'resolved';

    const getDialog = () => {
        switch (journal.kind) {
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

    const getTagChips = (tags?: Tag[]) => {
        if (tags === undefined || tags.length === 0) return <></>;
        return (
            <Stack direction="row" mt={1} flexWrap="wrap" gap={0.5} justifyContent="flex-end">
                {tags.map(tag => (
                    <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                ))}
            </Stack>
        );
    };

    const getContent = () => {
        switch (journal.kind) {
            case 'Diary':
                return (
                    <>
                        {!shouldShowDate && !isFromJournals && <Typography fontSize="1.15rem">{format(journal.diary!.date, 'yyyy-MM-dd E')}</Typography>}
                        <div className="line-clamp" style={{ marginTop: '0.5rem' }}>
                            {journal.diary!.text}
                        </div>
                        {getTagChips(journal.diary?.tags)}
                    </>
                );
            case 'ReadingNote':
                return (
                    <>
                        <Typography fontSize="1.15rem">
                            {journal.reading_note!.title}({journal.reading_note!.page_number})
                        </Typography>
                        <div className="line-clamp" style={{ marginTop: '0.5rem' }}>
                            {journal.reading_note!.text}
                        </div>
                        {getTagChips(journal.reading_note?.tags)}
                    </>
                );
            case 'ThinkingNote':
                return (
                    <>
                        {status === 'active' && (
                            <PsychologyAltIcon sx={{ position: 'absolute', top: 2, left: 2, color: 'rgba(0, 0, 0, 0.54)', fontSize: '1.25rem' }} />
                        )}
                        {status === 'resolved' && <CheckCircleIcon sx={{ position: 'absolute', top: 2, left: 2, color: green['A700'], fontSize: '1.25rem' }} />}
                        <Typography fontSize="1.15rem">{journal.thinking_note!.question}</Typography>
                        {journal.thinking_note!.answer && (
                            <Typography fontSize="1.15rem" ml={3}>
                                →{journal.thinking_note!.answer}
                            </Typography>
                        )}
                        <div className="line-clamp" style={{ marginTop: '0.5rem' }}>
                            {journal.thinking_note!.thought}
                        </div>
                        {getTagChips(journal.thinking_note?.tags)}
                    </>
                );
        }
    };

    const getJournalDate = () => {
        if (journal.kind === 'ThinkingNote' && status! === 'active') return <></>;
        if (!shouldShowDate) return <></>;
        switch (journal.kind) {
            case 'Diary':
                return (
                    <Typography fontSize="1.15rem" mt={1}>
                        {format(journal.diary!.date, 'yyyy-MM-dd E')}
                    </Typography>
                );
            case 'ReadingNote':
                return (
                    <Typography fontSize="1.15rem" mt={1}>
                        {format(journal.reading_note!.date, 'yyyy-MM-dd E')}
                    </Typography>
                );
            case 'ThinkingNote':
                return (
                    <Typography fontSize="1.15rem" mt={1}>
                        {format(journal.thinking_note!.updated_at, 'yyyy-MM-dd E')}
                    </Typography>
                );
        }
    };

    return (
        <Grid size={12} sx={{ textAlign: 'left' }}>
            {getJournalDate()}
            <Card onClick={() => setOpenedDialog('View')}>
                <CardContent sx={{ position: 'relative', paddingBottom: 0 }}>{getContent()}</CardContent>
                {journal.kind === 'ThinkingNote' && status! === 'resolved' && (
                    <Typography textAlign="right" fontSize="0.7rem" mr={1} mb={1}>
                        {status === 'resolved' && `解決：${format(new Date(journal.thinking_note!.resolved_at!), 'yyyy年MM月dd日')}`}
                    </Typography>
                )}
            </Card>
            {openedDialog && getDialog()}
        </Grid>
    );
};

export default memo(Journal);
