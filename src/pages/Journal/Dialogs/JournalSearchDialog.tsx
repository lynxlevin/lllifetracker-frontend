import { Button, Dialog, DialogActions, DialogContent, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import type { Tag } from '../../../types/tag';
import TagSelect from '../../../components/TagSelect';
import { useMemo } from 'react';
import useTagContext from '../../../hooks/useTagContext';
import { JOURNAL_SEARCH_PARAMS_DEFAULT, type JournalKind } from '../../../types/journal';
import useJournalContext from '../../../hooks/useJournalContext';

interface JournalSearchDialogProps {
    onClose: () => void;
    journalKindFilter: JournalKind[];
    setJournalKindFilter: React.Dispatch<React.SetStateAction<JournalKind[]>>;
}

const JournalSearchDialog = ({ onClose, journalKindFilter, setJournalKindFilter }: JournalSearchDialogProps) => {
    const { tags } = useTagContext();
    const { journals, searchParams, setSearchParams, searchJournals } = useJournalContext();

    const connectedTags = useMemo(() => {
        const tagIds: string[] = [];
        journals?.forEach(journal => {
            const tags = journal.diary !== null ? journal.diary.tags : journal.reading_note !== null ? journal.reading_note.tags : journal.thinking_note!.tags;

            tagIds.push(...tags.filter(tag => !tagIds.includes(tag.id)).map(tag => tag.id));
        });
        return tags?.filter(tag => tagIds.includes(tag.id));
    }, [journals, tags]);

    const clearParams = () => {
        setSearchParams(JOURNAL_SEARCH_PARAMS_DEFAULT);
        setJournalKindFilter(['Diary', 'ThinkingNote', 'ReadingNote']);
    };

    const submit = () => {
        searchJournals();
        onClose();
    };

    const handleKindSwitch = (event: React.ChangeEvent<HTMLInputElement>, kind: JournalKind) => {
        if (event.target.checked) {
            setJournalKindFilter(curr => {
                return [...curr, kind];
            });
        } else {
            setJournalKindFilter(curr => {
                const res = [...curr];
                const index = res.indexOf(kind);
                if (index > -1) {
                    res.splice(index, 1);
                }
                return res;
            });
        }
    };
    const handleDiarySwitch = (event: React.ChangeEvent<HTMLInputElement>) => handleKindSwitch(event, 'Diary');
    const handleReadingNoteSwitch = (event: React.ChangeEvent<HTMLInputElement>) => handleKindSwitch(event, 'ReadingNote');
    const handleThinkingNoteSwitch = (event: React.ChangeEvent<HTMLInputElement>) => handleKindSwitch(event, 'ThinkingNote');
    return (
        <Dialog open={true} onClose={submit} fullWidth>
            <DialogContent sx={{ pr: 0.5, pl: 0.5, pt: 2 }}>
                <Stack>
                    <FormControlLabel label="日記" control={<Switch checked={journalKindFilter.includes('Diary')} onChange={handleDiarySwitch} />} />
                    <FormControlLabel
                        label="思索ノート"
                        control={<Switch checked={journalKindFilter.includes('ThinkingNote')} onChange={handleThinkingNoteSwitch} />}
                    />
                    <FormControlLabel
                        label="読書ノート"
                        control={<Switch checked={journalKindFilter.includes('ReadingNote')} onChange={handleReadingNoteSwitch} />}
                    />
                    <TextField
                        value={searchParams.text ?? ''}
                        onChange={event => {
                            const value = event.target.value;
                            const text = value.length === 0 ? undefined : value;
                            setSearchParams(prev => {
                                return { text, tags: prev.tags, isDefault: text === undefined && prev.tags.length === 0 };
                            });
                        }}
                        label="内容"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TagSelect
                        tags={searchParams.tags}
                        setTags={(tags: Tag[]) => {
                            setSearchParams(prev => {
                                return { text: prev.text, tags, isDefault: prev.text === undefined && tags.length === 0 };
                            });
                        }}
                        tagsMasterProp={connectedTags}
                    />
                </Stack>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={clearParams}>クリア</Button>
                    <Button variant="contained" onClick={submit}>
                        検索
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default JournalSearchDialog;
