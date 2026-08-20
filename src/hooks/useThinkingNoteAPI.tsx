import { ThinkingNoteAPI, ThinkingNoteProps, ThinkingNoteUpdateProps } from '../apis/ThinkingNoteAPI';
import { ThinkingNote } from '../types/journal';
import useGlobalErrorContext from './useGlobalErrorContext';
import useJournalContext from './useJournalContext';

export type ThinkingNoteStatus = 'active' | 'resolved';

const useThinkingNoteAPI = () => {
    const { getJournals } = useJournalContext();
    const { handleAPIErrorThrowing } = useGlobalErrorContext();

    const createThinkingNote = async (params: ThinkingNoteProps) => {
        await ThinkingNoteAPI.create(params)
            .then(_ => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    const updateActiveThinkingNote = async (id: string, params: ThinkingNoteUpdateProps) => {
        await ThinkingNoteAPI.update(id, params)
            .then(_ => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    const resolveThinkingNote = async (thinkingNote: ThinkingNote) => {
        await ThinkingNoteAPI.update(thinkingNote.id, {
            question: thinkingNote.question,
            thought: thinkingNote.thought,
            answer: thinkingNote.answer,
            tag_ids: thinkingNote.tags.map(tag => tag.id),
            resolved_at: new Date().toISOString(),
        })
            .then(_ => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    const unResolveThinkingNote = async (thinkingNote: ThinkingNote) => {
        await ThinkingNoteAPI.update(thinkingNote.id, {
            question: thinkingNote.question,
            thought: thinkingNote.thought,
            answer: thinkingNote.answer,
            tag_ids: thinkingNote.tags.map(tag => tag.id),
            resolved_at: null,
        })
            .then(_ => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    const deleteThinkingNote = async (thinkingNote: ThinkingNote) => {
        await ThinkingNoteAPI.delete(thinkingNote.id)
            .then(_ => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
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
