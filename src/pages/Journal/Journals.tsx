import { Badge, Box, Grid, IconButton, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useTagContext from '../../hooks/useTagContext';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Tag } from '../../types/tag';
import Journal, { type JournalKind } from './Journal';
import useJournalContext from '../../hooks/useJournalContext';
import JournalFilterDialog from './JournalFilterDialog';
import JournalCreateDialog from './JournalCreateDialog';
import { format } from 'date-fns';

type DialogType = 'Create' | 'Filter';

const Journals = () => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [journalKindFilter, setJournalKindFilter] = useState<JournalKind[]>(['Diary', 'ThinkingNote', 'ReadingNote']);
    const [tagsFilter, setTagsFilter] = useState<Tag[]>([]);

    const { isLoading: isLoadingJournal, getJournals, journals } = useJournalContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <JournalCreateDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Filter':
                return (
                    <JournalFilterDialog
                        onClose={() => setOpenedDialog(undefined)}
                        journals={journals!}
                        tagsFilter={tagsFilter}
                        setTagsFilter={setTagsFilter}
                        journalKindFilter={journalKindFilter}
                        setJournalKindFilter={setJournalKindFilter}
                    />
                );
        }
    };

    const filteredJournals = useMemo(() => {
        const kindFiltered =
            journals?.filter(journal => {
                const kind: JournalKind = journal.diary !== null ? 'Diary' : journal.reading_note !== null ? 'ReadingNote' : 'ThinkingNote';
                return journalKindFilter.includes(kind);
            }) ?? [];

        if (tagsFilter.length === 0) return kindFiltered ?? [];
        return (
            journals?.filter(journal => {
                const tags =
                    journal.diary !== null ? journal.diary.tags : journal.reading_note !== null ? journal.reading_note.tags : journal.thinking_note?.tags;
                return tags!.some(tag => tagsFilter.map(tag => tag.id).includes(tag.id));
            }) ?? []
        );
    }, [journalKindFilter, journals, tagsFilter]);

    const getContent = () => {
        let lastEntryDate: string;
        return filteredJournals.map(journal => {
            const journalId = journal.diary?.id ?? journal.reading_note?.id ?? journal.thinking_note?.id;
            const journalDate = format((journal.diary?.date ?? journal.reading_note?.date ?? journal.thinking_note?.updated_at)!, 'yyyy-MM-dd');
            const shouldShowDate = lastEntryDate !== journalDate;
            lastEntryDate = journalDate;
            return <Journal key={journalId} journal={journal} shouldShowDate={shouldShowDate} isFromJournals />;
        });
    };

    useEffect(() => {
        if (journals === undefined && !isLoadingJournal) getJournals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [journals, getJournals]);

    useEffect(() => {
        if (tags === undefined && !isLoadingTag) getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags, getTags]);
    return (
        <BasePage pageName="Journals">
            <Box sx={{ pt: 0.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="end" mt={2}>
                    <Badge badgeContent={tagsFilter.length} color="primary" overlap="circular">
                        <IconButton
                            onClick={() => {
                                setOpenedDialog('Filter');
                            }}
                        >
                            <FilterAltIcon />
                        </IconButton>
                    </Badge>
                    <IconButton
                        onClick={() => {
                            setOpenedDialog('Create');
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Stack>
                <Box sx={{ pb: 4 }}>
                    <Grid container spacing={1}>
                        {getContent()}
                    </Grid>
                </Box>
                {openedDialog && getDialog()}
            </Box>
        </BasePage>
    );
};

export default Journals;
