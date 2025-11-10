import { useCallback, useContext, useState } from 'react';
import { ThinkingNoteContext, SetThinkingNoteContext } from '../contexts/thinking-note-context';
import { ThinkingNoteAPI, ThinkingNoteProps } from '../apis/ThinkingNoteAPI';
import { ThinkingNote } from '../types/journal';
import useJournalContext from './useJournalContext';

export type ThinkingNoteStatus = 'active' | 'resolved' | 'archived';

const useThinkingNoteContext = () => {
    const thinkingNoteContext = useContext(ThinkingNoteContext);
    const setThinkingNoteContext = useContext(SetThinkingNoteContext);
    const { clearJournalsCache } = useJournalContext();

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
                    api = ThinkingNoteAPI.listActive();
                    break;
                case 'resolved':
                    api = ThinkingNoteAPI.listResolved();
                    break;
                case 'archived':
                    api = ThinkingNoteAPI.listArchived();
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
            clearJournalsCache();
            setThinkingNoteContext.setThinkingNotes(prev => {
                return { ...prev, active: undefined };
            });
        });
    };

    const updateActiveThinkingNote = (id: string, params: ThinkingNoteProps) => {
        ThinkingNoteAPI.update(id, { ...params, resolved_at: null, archived_at: null }).then(_ => {
            clearJournalsCache();
            setThinkingNoteContext.setThinkingNotes(prev => {
                return { ...prev, active: undefined };
            });
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
            clearJournalsCache();
            setThinkingNoteContext.setThinkingNotes(prev => {
                return { ...prev, active: undefined, resolved: undefined };
            });
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
            clearJournalsCache();
            setThinkingNoteContext.setThinkingNotes(prev => {
                return { ...prev, active: undefined, resolved: undefined };
            });
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
            clearJournalsCache();
            setThinkingNoteContext.setThinkingNotes(prev => {
                return { ...prev, active: undefined, archived: undefined };
            });
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
            clearJournalsCache();
            setThinkingNoteContext.setThinkingNotes(prev => {
                return { ...prev, active: undefined, archived: undefined };
            });
        });
    };

    const deleteThinkingNote = (thinkingNote: ThinkingNote) => {
        ThinkingNoteAPI.delete(thinkingNote.id).then(_ => {
            if (thinkingNote.resolved_at === null && thinkingNote.archived_at === null) {
                clearJournalsCache();
                setThinkingNoteContext.setThinkingNotes(prev => {
                    return { ...prev, active: undefined };
                });
            } else if (thinkingNote.resolved_at !== null) {
                clearJournalsCache();
                setThinkingNoteContext.setThinkingNotes(prev => {
                    return { ...prev, resolved: undefined };
                });
            } else if (thinkingNote.archived_at !== null) {
                clearJournalsCache();
                setThinkingNoteContext.setThinkingNotes(prev => {
                    return { ...prev, archived: undefined };
                });
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
