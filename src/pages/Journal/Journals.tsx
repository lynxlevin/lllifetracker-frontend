import { Badge, Box, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useTagContext from '../../hooks/useTagContext';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import ShortTextIcon from '@mui/icons-material/ShortText';
import NotesIcon from '@mui/icons-material/Notes';
import SearchIcon from '@mui/icons-material/Search';
import Journal from './Journal';
import useJournalContext from '../../hooks/useJournalContext';
import JournalCreateDialog from './Dialogs/JournalCreateDialog';
import { format } from 'date-fns';
import type { Journal as JournalType, JournalKind } from '../../types/journal';
import { JournalIcon } from '../../components/CustomIcons';
import useLocalStorage from '../../hooks/useLocalStorage';
import { JOURNAL_SEARCH_PARAMS_DEFAULT, JournalSearchParams } from '../../apis/JournalAPI';
import JournalSearchDialog from './Dialogs/JournalSearchDialog';

type DialogType = 'Create' | 'Filter' | 'Search';

const Journals = () => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [searchedJournals, setSearchedJournals] = useState<JournalType[]>();
    const [searchParams, setSearchParams] = useState<JournalSearchParams>(JOURNAL_SEARCH_PARAMS_DEFAULT);
    const [journalKindFilter, setJournalKindFilter] = useState<JournalKind[]>(['Diary', 'ThinkingNote', 'ReadingNote']);
    const { journalsDisplayMode, setJournalsDisplayMode } = useLocalStorage();

    const { isLoading: isLoadingJournal, getJournals, journals } = useJournalContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <JournalCreateDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Search':
                return (
                    <JournalSearchDialog
                        onClose={() => setOpenedDialog(undefined)}
                        setSearchedJournals={setSearchedJournals}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        journalKindFilter={journalKindFilter}
                        setJournalKindFilter={setJournalKindFilter}
                    />
                );
        }
    };

    const filteredJournals = useMemo(() => {
        const journalsToUse = searchedJournals === undefined ? journals : searchedJournals;
        if (journalsToUse === undefined) return [];

        const kindFiltered = journalsToUse.filter(journal => {
            return journalKindFilter.includes(journal.kind);
        });

        return kindFiltered;
    }, [journalKindFilter, journals, searchedJournals]);

    const getContent = () => {
        let lastEntryDate: string;
        return filteredJournals.map(journal => {
            const journalId = journal.diary?.id ?? journal.reading_note?.id ?? journal.thinking_note?.id;
            const journalDate = format(
                (journal.diary?.date ?? journal.reading_note?.date ?? journal.thinking_note?.resolved_at ?? journal.thinking_note?.updated_at)!,
                'yyyy-MM-dd',
            );
            const shouldShowDate = lastEntryDate !== journalDate;
            lastEntryDate = journalDate;
            return <Journal key={journalId} journal={journal} shouldShowDate={shouldShowDate} isFromJournals itemDisplayMode={journalsDisplayMode.item} />;
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
            <Box sx={{ pt: 4 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" pb={0.5}>
                    <Stack direction="row" mt={0.5} alignItems="center">
                        <JournalIcon size="small" />
                        <Typography variant="h6" textAlign="left">
                            日誌
                        </Typography>
                    </Stack>
                    <div style={{ flexGrow: 1 }} />
                    <IconButton
                        onClick={() => {
                            setOpenedDialog('Search');
                        }}
                    >
                        <Badge invisible={searchedJournals === undefined && journalKindFilter.length === 3} variant="dot" color="primary" overlap="circular">
                            <SearchIcon />
                        </Badge>
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setOpenedDialog('Create');
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={event => {
                            setMenuAnchor(event.currentTarget);
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                        <Typography variant="body2" textAlign="center" color="grey">
                            表示オプション
                        </Typography>
                        <MenuItem
                            onClick={() => {
                                setJournalsDisplayMode({ ...journalsDisplayMode, item: 'Abbreviated' });
                                setMenuAnchor(null);
                            }}
                            disabled={journalsDisplayMode.item === 'Abbreviated'}
                        >
                            <ListItemIcon>
                                <ShortTextIcon />
                            </ListItemIcon>
                            <ListItemText>省略表示</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setJournalsDisplayMode({ ...journalsDisplayMode, item: 'Full' });
                                setMenuAnchor(null);
                            }}
                            disabled={journalsDisplayMode.item === 'Full'}
                        >
                            <ListItemIcon>
                                <NotesIcon />
                            </ListItemIcon>
                            <ListItemText>全て表示</ListItemText>
                        </MenuItem>
                    </Menu>
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
