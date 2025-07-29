import { Badge, Box, Grid, IconButton, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../../components/BasePage';
import useReadingNoteContext from '../../../hooks/useReadingNoteContext';
import ReadingNote from './ReadingNote';
import useTagContext from '../../../hooks/useTagContext';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ReadingNoteDialog from './Dialogs/ReadingNoteDialog';
import ReadingNoteFilterDialog from './Dialogs/ReadingNoteFilterDialog';
import { Tag } from '../../../types/tag';

type DialogType = 'Create' | 'Filter';

const ReadingNotes = () => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [tagsFilter, setTagsFilter] = useState<Tag[]>([]);

    const { isLoading: isLoadingReadingNote, getReadingNotes, readingNotes } = useReadingNoteContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const isLoading = isLoadingReadingNote || isLoadingTag;

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <ReadingNoteDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Filter':
                return <ReadingNoteFilterDialog onClose={() => setOpenedDialog(undefined)} tagsFilter={tagsFilter} setTagsFilter={setTagsFilter} />;
        }
    };

    const filteredReadingNotes = useMemo(() => {
        if (tagsFilter.length === 0) return readingNotes ?? [];
        return readingNotes?.filter(readingNote => readingNote.tags.some(tag => tagsFilter.map(tag => tag.id).includes(tag.id))) ?? [];
    }, [readingNotes, tagsFilter]);

    useEffect(() => {
        if (readingNotes === undefined && !isLoadingReadingNote) getReadingNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [readingNotes, getReadingNotes]);

    useEffect(() => {
        if (tags === undefined && !isLoadingTag) getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags, getTags]);
    return (
        <BasePage isLoading={isLoading} pageName="Journals">
            <Box sx={{ pt: 0.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="end" mt={3}>
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
                    <Grid container spacing={2}>
                        {filteredReadingNotes.map(readingNote => (
                            <ReadingNote key={readingNote.id} readingNote={readingNote} />
                        ))}
                    </Grid>
                </Box>
                {openedDialog && getDialog()}
            </Box>
        </BasePage>
    );
};

export default ReadingNotes;
