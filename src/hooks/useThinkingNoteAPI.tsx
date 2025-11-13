import { ThinkingNoteAPI, ThinkingNoteProps, ThinkingNoteUpdateProps } from '../apis/ThinkingNoteAPI';
import { ThinkingNote } from '../types/journal';
import useJournalContext from './useJournalContext';

export type ThinkingNoteStatus = 'active' | 'resolved';

const useThinkingNoteAPI = () => {
    const { clearJournalsCache } = useJournalContext();

    const createThinkingNote = (params: ThinkingNoteProps) => {
        ThinkingNoteAPI.create(params).then(_ => {
            clearJournalsCache();
        });
    };

    const updateActiveThinkingNote = (id: string, params: ThinkingNoteUpdateProps) => {
        ThinkingNoteAPI.update(id, params).then(_ => {
            clearJournalsCache();
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
            clearJournalsCache();
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
            clearJournalsCache();
        });
    };

    const deleteThinkingNote = (thinkingNote: ThinkingNote) => {
        ThinkingNoteAPI.delete(thinkingNote.id).then(_ => {
            clearJournalsCache();
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
