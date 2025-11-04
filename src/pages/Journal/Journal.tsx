import { memo } from 'react';
import Diary from './Diaries/Diary';
import type { Journal as JournalType } from '../../types/journal';
import ReadingNote from './ReadingNotes/ReadingNote';
import ThinkingNote from './ThinkingNotes/ThinkingNote';

interface JournalProps {
    journal: JournalType;
}

const Journal = ({ journal }: JournalProps) => {
    if (journal.diary !== null) return <Diary diary={journal.diary} />;
    if (journal.reading_note !== null) return <ReadingNote readingNote={journal.reading_note} />;
    if (journal.thinking_note !== null) return <ThinkingNote thinkingNote={journal.thinking_note} />;
    return <></>;
};

export default memo(Journal);
