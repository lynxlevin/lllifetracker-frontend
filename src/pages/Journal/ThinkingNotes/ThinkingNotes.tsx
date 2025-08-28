import { Badge, Box, CircularProgress, Grid, IconButton, Stack, Tab, Tabs } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../../components/BasePage';
import useThinkingNoteContext, { ThinkingNoteStatus } from '../../../hooks/useThinkingNoteContext';
import ThinkingNote from './ThinkingNote';
import useTagContext from '../../../hooks/useTagContext';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ThinkingNoteDialog from './Dialogs/ThinkingNoteDialog';
import ThinkingNoteFilterDialog from './Dialogs/ThinkingNoteFilterDialog';
import { Tag } from '../../../types/tag';
import useLocalStorage from '../../../hooks/useLocalStorage';

type DialogType = 'Create' | 'Filter';

const ThinkingNotes = () => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [tagsFilter, setTagsFilter] = useState<Tag[]>([]);
    const [thinkingNoteStatus, setThinkingNoteStatus] = useState<ThinkingNoteStatus>('active');
    const [showHidden, setShowHidden] = useState(false);
    const [filterClickCount, setFilterClickCount] = useState(0);

    const { isLoading: isLoadingThinkingNote, getThinkingNotes, thinkingNotes } = useThinkingNoteContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();
    const { itemIdsToHide } = useLocalStorage();

    const isLoading = isLoadingThinkingNote || isLoadingTag;

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <ThinkingNoteDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Filter':
                return (
                    <ThinkingNoteFilterDialog
                        onClose={() => setOpenedDialog(undefined)}
                        thinkingNotes={thinkingNotes[thinkingNoteStatus]!}
                        tagsFilter={tagsFilter}
                        setTagsFilter={setTagsFilter}
                    />
                );
        }
    };

    const filteredThinkingNotes = useMemo(() => {
        if (itemIdsToHide === undefined) return [];
        let notes = thinkingNotes[thinkingNoteStatus] ?? [];

        if (!showHidden && itemIdsToHide.length > 0) notes = notes.filter(thinkingNote => !itemIdsToHide.includes(thinkingNote.id));

        if (tagsFilter.length > 0) notes = notes.filter(thinkingNote => thinkingNote.tags.some(tag => tagsFilter.map(tag => tag.id).includes(tag.id)));
        return notes;
    }, [thinkingNotes, thinkingNoteStatus, showHidden, itemIdsToHide, tagsFilter]);

    useEffect(() => {
        if (filterClickCount === 5) setShowHidden(true);
    }, [filterClickCount]);

    useEffect(() => {
        if (thinkingNotes[thinkingNoteStatus] === undefined && !isLoadingThinkingNote) getThinkingNotes(thinkingNoteStatus);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thinkingNotes, thinkingNoteStatus, getThinkingNotes]);

    useEffect(() => {
        if (tags === undefined && !isLoadingTag) getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags, getTags]);
    return (
        <BasePage pageName="Journals">
            <Box sx={{ pt: 0.5 }}>
                <Stack direction="row" alignItems="bottom" mt={3}>
                    <Tabs
                        value={thinkingNoteStatus}
                        onChange={(_: React.SyntheticEvent, newValue: ThinkingNoteStatus) => setThinkingNoteStatus(newValue)}
                        sx={{ marginBottom: 1 }}
                    >
                        <Tab label="悩み中" value="active" />
                        <Tab label="解決済み" value="resolved" />
                        <Tab label="アーカイブ" value="archived" />
                    </Tabs>
                    <div style={{ flexGrow: 1 }} />
                    <Badge badgeContent={tagsFilter.length} color="primary" overlap="circular">
                        <IconButton
                            disabled={thinkingNotes.active === undefined}
                            onClick={() => {
                                setOpenedDialog('Filter');
                                setFilterClickCount(prev => prev + 1);
                            }}
                        >
                            <FilterAltIcon />
                        </IconButton>
                    </Badge>
                    <IconButton
                        onClick={() => {
                            setOpenedDialog('Create');
                            setFilterClickCount(0);
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Stack>
                <Box sx={{ pb: 4 }} onClick={() => setFilterClickCount(0)}>
                    <Grid container spacing={2}>
                        {isLoading ? (
                            <CircularProgress style={{ margin: 'auto' }} />
                        ) : (
                            filteredThinkingNotes.map(thinkingNote => <ThinkingNote key={thinkingNote.id} thinkingNote={thinkingNote} />)
                        )}
                    </Grid>
                </Box>
                {openedDialog && getDialog()}
            </Box>
        </BasePage>
    );
};

export default ThinkingNotes;
