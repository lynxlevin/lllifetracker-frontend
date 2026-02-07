import { ThinkingNoteAPI, ThinkingNoteProps, ThinkingNoteUpdateProps } from '../apis/ThinkingNoteAPI';
import { ThinkingNote } from '../types/journal';
import useJournalContext from './useJournalContext';

export type ThinkingNoteStatus = 'active' | 'resolved';

const useThinkingNoteAPI = () => {
    const { getJournals } = useJournalContext();

    const createThinkingNote = (params: ThinkingNoteProps) => {
        ThinkingNoteAPI.create(params).then(_ => {
            getJournals();
        });
    };

    const updateActiveThinkingNote = (id: string, params: ThinkingNoteUpdateProps) => {
        ThinkingNoteAPI.update(id, params).then(_ => {
            getJournals();
        });
    };

    const resolveThinkingNote = (thinkingNote: ThinkingNote) => {
        ThinkingNoteAPI.update(thinkingNote.id, {
            question: thinkingNote.question,
            thought: thinkingNote.thought,
            answer: thinkingNote.answer,
            tag_ids: thinkingNote.tags.map(tag => tag.id),
            resolved_at: new Date().toISOString(),
        }).then(_ => {
            getJournals();
        });
    };

    const unResolveThinkingNote = (thinkingNote: ThinkingNote) => {
        ThinkingNoteAPI.update(thinkingNote.id, {
            question: thinkingNote.question,
            thought: thinkingNote.thought,
            answer: thinkingNote.answer,
            tag_ids: thinkingNote.tags.map(tag => tag.id),
            resolved_at: null,
        }).then(_ => {
            getJournals();
        });
    };

    const deleteThinkingNote = (thinkingNote: ThinkingNote) => {
        ThinkingNoteAPI.delete(thinkingNote.id).then(_ => {
            getJournals();
        });
    };

    return {
        createThinkingNote,
        updateActiveThinkingNote,
        resolveThinkingNote,
        unResolveThinkingNote,
        deleteThinkingNote,
    };
};

export default useThinkingNoteAPI;
