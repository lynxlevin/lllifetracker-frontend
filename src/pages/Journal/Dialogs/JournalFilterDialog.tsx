import { Button, Dialog, DialogActions, DialogContent, FormControlLabel, Stack, Switch } from '@mui/material';
import type { Tag } from '../../../types/tag';
import TagSelect from '../../../components/TagSelect';
import { useMemo } from 'react';
import useTagContext from '../../../hooks/useTagContext';
import type { Journal } from '../../../types/journal';
import { JournalKind } from '../Journal';

interface JournalFilterDialogProps {
    onClose: () => void;
    journals: Journal[];
    tagsFilter: Tag[];
    setTagsFilter: React.Dispatch<React.SetStateAction<Tag[]>>;
    journalKindFilter: JournalKind[];
    setJournalKindFilter: React.Dispatch<React.SetStateAction<JournalKind[]>>;
}

const JournalFilterDialog = ({ onClose, journals, tagsFilter, setTagsFilter, journalKindFilter, setJournalKindFilter }: JournalFilterDialogProps) => {
    const { tags } = useTagContext();
    const connectedTags = useMemo(() => {
        const tagIds: string[] = [];
        journals?.forEach(journal => {
            const tags = journal.diary !== null ? journal.diary.tags : journal.reading_note !== null ? journal.reading_note.tags : journal.thinking_note?.tags;

            tagIds.push(...tags!.filter(tag => !tagIds.includes(tag.id)).map(tag => tag.id));
        });
        return tags?.filter(tag => tagIds.includes(tag.id));
    }, [journals, tags]);

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
        <Dialog open={true} onClose={onClose} fullWidth>
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
                    <TagSelect tags={tagsFilter} setTags={setTagsFilter} tagsMasterProp={connectedTags} />
                </Stack>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={() => setTagsFilter([])}>クリア</Button>
                    <Button variant="contained" onClick={onClose}>
                        検索
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default JournalFilterDialog;
