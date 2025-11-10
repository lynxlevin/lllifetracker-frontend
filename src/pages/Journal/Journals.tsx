import { Badge, Box, CircularProgress, Grid, IconButton, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useTagContext from '../../hooks/useTagContext';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Tag } from '../../types/tag';
import Journal from './Journal';
import useJournalContext from '../../hooks/useJournalContext';
import JournalFilterDialog from './JournalFilterDialog';

type DialogType = 'Create' | 'Filter';

const Journals = () => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [tagsFilter, setTagsFilter] = useState<Tag[]>([]);

    const { isLoading: isLoadingJournal, getJournals, journals } = useJournalContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Filter':
                return (
                    <JournalFilterDialog
                        onClose={() => setOpenedDialog(undefined)}
                        journals={journals!}
                        tagsFilter={tagsFilter}
                        setTagsFilter={setTagsFilter}
                    />
                );
        }
    };

    const filteredJournals = useMemo(() => {
        if (tagsFilter.length === 0) return journals ?? [];
        return (
            journals?.filter(journal => {
                const tags =
                    journal.diary !== null ? journal.diary.tags : journal.reading_note !== null ? journal.reading_note.tags : journal.thinking_note?.tags;
                return tags!.some(tag => tagsFilter.map(tag => tag.id).includes(tag.id));
            }) ?? []
        );
    }, [journals, tagsFilter]);

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
                </Stack>
                <Box sx={{ pb: 4 }}>
                    {journals === undefined ? (
                        <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                    ) : (
                        <Grid container spacing={2}>
                            {filteredJournals.map(journal => {
                                const journalId = journal.diary?.id ?? journal.reading_note?.id ?? journal.thinking_note?.id;
                                return <Journal key={journalId} journal={journal} />;
                            })}
                        </Grid>
                    )}
                </Box>
                {openedDialog && getDialog()}
            </Box>
        </BasePage>
    );
};

export default Journals;
