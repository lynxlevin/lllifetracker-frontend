import { Button, Dialog, DialogActions, DialogContent, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import type { Tag } from '../../../types/tag';
import TagSelect from '../../../components/TagSelect';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import useTagContext from '../../../hooks/useTagContext';
import type { Journal, JournalKind } from '../../../types/journal';
import { JOURNAL_SEARCH_PARAMS_DEFAULT, JournalAPI, JournalSearchParams } from '../../../apis/JournalAPI';
import useJournalContext from '../../../hooks/useJournalContext';

interface JournalSearchDialogProps {
    onClose: () => void;
    setSearchedJournals: Dispatch<SetStateAction<Journal[] | undefined>>;
    searchParams: JournalSearchParams;
    setSearchParams: Dispatch<SetStateAction<JournalSearchParams>>;
    journalKindFilter: JournalKind[];
    setJournalKindFilter: React.Dispatch<React.SetStateAction<JournalKind[]>>;
}

const JournalSearchDialog = ({
    onClose,
    setSearchedJournals,
    searchParams,
    setSearchParams,
    journalKindFilter,
    setJournalKindFilter,
}: JournalSearchDialogProps) => {
    const [text, setText] = useState(searchParams.text);
    const [selectedTags, setSelectedTags] = useState<Tag[]>();
    const { tags } = useTagContext();
    const { journals } = useJournalContext();

    const connectedTags = useMemo(() => {
        const tagIds: string[] = [];
        journals?.forEach(journal => {
            const tags = journal.diary !== null ? journal.diary.tags : journal.reading_note !== null ? journal.reading_note.tags : journal.thinking_note?.tags;

            tagIds.push(...tags!.filter(tag => !tagIds.includes(tag.id)).map(tag => tag.id));
        });
        return tags?.filter(tag => tagIds.includes(tag.id));
    }, [journals, tags]);

    const updateSearchParams = (): JournalSearchParams => {
        const params = { text, tag_ids: selectedTags?.map(tag => tag.id) ?? [] };
        setSearchParams(params);
        return params;
    };

    const clearParams = () => {
        setText(undefined);
        setSelectedTags([]);
        setSearchParams(JOURNAL_SEARCH_PARAMS_DEFAULT);
        setSearchedJournals(undefined);
    };

    const searchJournals = () => {
        const params = updateSearchParams();
        const noSearch = params.text === undefined && params.tag_ids.length === 0;
        if (noSearch) {
            clearParams();
            return onClose();
        }
        JournalAPI.search(params).then(res => setSearchedJournals(res.data));
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

    useEffect(() => {
        if (selectedTags !== undefined) return;
        if (tags === undefined) return;
        // NOTE: This `!` is necessary because TypeScript compiler doesn't take filter method into account and thinks it's (Tag | undefined)[]
        setSelectedTags(searchParams.tag_ids.map(id => tags.find(tag => tag.id === id)!).filter(tag => tag !== undefined));
    }, [searchParams.tag_ids, selectedTags, tags]);
    return (
        <Dialog open={true} onClose={searchJournals} fullWidth>
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
                        value={text ?? ''}
                        onChange={event => {
                            const value = event.target.value;
                            setText(value);
                        }}
                        label="内容"
                        fullWidth
                    />
                    <TagSelect tags={selectedTags} setTags={setSelectedTags} tagsMasterProp={connectedTags} />
                </Stack>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={clearParams}>クリア</Button>
                    <Button variant="contained" onClick={searchJournals}>
                        検索
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default JournalSearchDialog;
