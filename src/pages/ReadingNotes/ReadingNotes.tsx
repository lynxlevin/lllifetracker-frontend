import { Box, Grid2 as Grid, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import BasePage from '../../components/BasePage';
import useReadingNoteContext from '../../hooks/useReadingNoteContext';
import ReadingNote from './ReadingNote';
import useTagContext from '../../hooks/useTagContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ReadingNoteDialog from './Dialogs/ReadingNoteDialog';

const ReadingNotes = () => {
    const [isCreateReadingNoteDialogOpen, setIsCreateReadingNoteDialogOpen] = useState(false);

    const { isLoading: isLoadingReadingNote, getReadingNotes, readingNotes } = useReadingNoteContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const isLoading = isLoadingReadingNote || isLoadingTag;

    useEffect(() => {
        if (readingNotes === undefined && !isLoadingReadingNote) getReadingNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [readingNotes, getReadingNotes]);

    useEffect(() => {
        if (tags === undefined && !isLoadingTag) getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags, getTags]);
    return (
        <BasePage isLoading={isLoading} pageName='Memos'>
            <Box sx={{ pt: 0.5 }}>
                <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                    <IconButton
                        onClick={() => {
                            setIsCreateReadingNoteDialogOpen(true);
                        }}
                        aria-label='add'
                        color='primary'
                        sx={{ position: 'absolute', top: 0, right: 0 }}
                    >
                        <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                </Box>
                <Box sx={{ pt: 2, pb: 4, mt: 6 }}>
                    <Grid container spacing={2}>
                        {readingNotes?.map(readingNote => (
                            <ReadingNote key={readingNote.id} readingNote={readingNote} />
                        ))}
                    </Grid>
                </Box>
                {isCreateReadingNoteDialogOpen && <ReadingNoteDialog onClose={() => setIsCreateReadingNoteDialogOpen(false)} />}
            </Box>
        </BasePage>
    );
};

export default ReadingNotes;
