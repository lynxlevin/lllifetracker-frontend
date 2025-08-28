import { useCallback, useContext, useState } from 'react';
import { ThinkingNoteContext, SetThinkingNoteContext } from '../contexts/thinking-note-context';
import { ThinkingNoteAPI, ThinkingNoteProps } from '../apis/ThinkingNoteAPI';
import { ThinkingNote } from '../types/journal';

export type ThinkingNoteStatus = 'active' | 'resolved' | 'archived';

const useThinkingNoteContext = () => {
    const thinkingNoteContext = useContext(ThinkingNoteContext);
    const setThinkingNoteContext = useContext(SetThinkingNoteContext);

    const [isLoading, setIsLoading] = useState(false);

    const thinkingNotes = thinkingNoteContext.thinkingNotes;
    const clearThinkingNotesCache = () => {
        setThinkingNoteContext.setThinkingNotes({ active: undefined, resolved: undefined, archived: undefined });
    };

    const getThinkingNotes = useCallback(
        (type: ThinkingNoteStatus) => {
            setIsLoading(true);
            let api;
            switch (type) {
                case 'active':
                    api = ThinkingNoteAPI.list_active();
                    break;
                case 'resolved':
                    api = ThinkingNoteAPI.list_resolved();
                    break;
                case 'archived':
                    api = ThinkingNoteAPI.list_archived();
                    break;
            }

            api.then(res => {
                setThinkingNoteContext.setThinkingNotes(prev => {
                    const toBe = { ...prev };
                    toBe[type] = res.data;
                    return toBe;
                });
            })
                .catch(e => {
                    console.error(e);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [setThinkingNoteContext],
    );

    const createThinkingNote = (params: ThinkingNoteProps) => {
        ThinkingNoteAPI.create(params).then(_ => {
            getThinkingNotes('active');
        });
    };

    const updateActiveThinkingNote = (id: string, params: ThinkingNoteProps) => {
        ThinkingNoteAPI.update(id, { ...params, resolved_at: null, archived_at: null }).then(_ => {
            getThinkingNotes('active');
        });
    };

    const resolveThinkingNote = (thinkingNote: ThinkingNote) => {
        ThinkingNoteAPI.update(thinkingNote.id, {
            question: thinkingNote.question,
            thought: thinkingNote.thought,
            answer: thinkingNote.answer,
            tag_ids: thinkingNote.tags.map(tag => tag.id),
            resolved_at: new Date().toISOString(),
            archived_at: null,
        }).then(_ => {
            getThinkingNotes('active');
            getThinkingNotes('resolved');
        });
    };

    const unResolveThinkingNote = (thinkingNote: ThinkingNote) => {
        ThinkingNoteAPI.update(thinkingNote.id, {
            question: thinkingNote.question,
            thought: thinkingNote.thought,
            answer: thinkingNote.answer,
            tag_ids: thinkingNote.tags.map(tag => tag.id),
            resolved_at: null,
            archived_at: null,
        }).then(_ => {
            getThinkingNotes('active');
            getThinkingNotes('resolved');
        });
    };

    const archiveThinkingNote = (thinkingNote: ThinkingNote) => {
        ThinkingNoteAPI.update(thinkingNote.id, {
            question: thinkingNote.question,
            thought: thinkingNote.thought,
            answer: thinkingNote.answer,
            tag_ids: thinkingNote.tags.map(tag => tag.id),
            resolved_at: null,
            archived_at: new Date().toISOString(),
        }).then(_ => {
            getThinkingNotes('active');
            getThinkingNotes('archived');
        });
    };

    const unarchiveThinkingNote = (thinkingNote: ThinkingNote) => {
        ThinkingNoteAPI.update(thinkingNote.id, {
            question: thinkingNote.question,
            thought: thinkingNote.thought,
            answer: thinkingNote.answer,
            tag_ids: thinkingNote.tags.map(tag => tag.id),
            resolved_at: null,
            archived_at: null,
        }).then(_ => {
            getThinkingNotes('active');
            getThinkingNotes('archived');
        });
    };

    const deleteThinkingNote = (thinkingNote: ThinkingNote) => {
        ThinkingNoteAPI.delete(thinkingNote.id).then(_ => {
            if (thinkingNote.resolved_at === null && thinkingNote.archived_at === null) {
                getThinkingNotes('active');
            } else if (thinkingNote.resolved_at !== null) {
                getThinkingNotes('resolved');
            } else if (thinkingNote.archived_at !== null) {
                getThinkingNotes('archived');
            }
        });
    };

    return {
        isLoading,
        thinkingNotes,
        clearThinkingNotesCache,
        getThinkingNotes,
        createThinkingNote,
        updateActiveThinkingNote,
        resolveThinkingNote,
        unResolveThinkingNote,
        archiveThinkingNote,
        unarchiveThinkingNote,
        deleteThinkingNote,
    };
};

export default useThinkingNoteContext;
