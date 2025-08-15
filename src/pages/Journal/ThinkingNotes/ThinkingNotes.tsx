import { Badge, Box, Grid, IconButton, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../../components/BasePage';
import useThinkingNoteContext from '../../../hooks/useThinkingNoteContext';
import ThinkingNote from './ThinkingNote';
import useTagContext from '../../../hooks/useTagContext';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ThinkingNoteDialog from './Dialogs/ThinkingNoteDialog';
import ThinkingNoteFilterDialog from './Dialogs/ThinkingNoteFilterDialog';
import { Tag } from '../../../types/tag';

type DialogType = 'Create' | 'Filter';

const ThinkingNotes = () => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [tagsFilter, setTagsFilter] = useState<Tag[]>([]);

    const { isLoading: isLoadingThinkingNote, getThinkingNotes, thinkingNotes } = useThinkingNoteContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const isLoading = isLoadingThinkingNote || isLoadingTag;

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <ThinkingNoteDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Filter':
                return (
                    <ThinkingNoteFilterDialog
                        onClose={() => setOpenedDialog(undefined)}
                        thinkingNotes={thinkingNotes.active!}
                        tagsFilter={tagsFilter}
                        setTagsFilter={setTagsFilter}
                    />
                );
        }
    };

    // const filteredThinkingNotes = useMemo(() => {
    //     if (tagsFilter.length === 0) return thinkingNotes ?? [];
    //     return thinkingNotes?.filter(thinkingNote => thinkingNote.tags.some(tag => tagsFilter.map(tag => tag.id).includes(tag.id))) ?? [];
    // }, [thinkingNotes, tagsFilter]);

    useEffect(() => {
        if (thinkingNotes.active === undefined && !isLoadingThinkingNote) getThinkingNotes('active');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thinkingNotes, getThinkingNotes]);

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
                            disabled={thinkingNotes.active === undefined}
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
                        {/* {filteredThinkingNotes.map(thinkingNote => (
                            <ThinkingNote key={thinkingNote.id} thinkingNote={thinkingNote} />
                        ))} */}
                        {thinkingNotes.active?.map(thinkingNote => <ThinkingNote key={thinkingNote.id} thinkingNote={thinkingNote} />)}
                    </Grid>
                </Box>
                {openedDialog && getDialog()}
            </Box>
        </BasePage>
    );
};

export default ThinkingNotes;
