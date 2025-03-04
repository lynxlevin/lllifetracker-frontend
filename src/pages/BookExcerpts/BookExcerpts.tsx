import { Box, Grid2 as Grid, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import BasePage from '../../components/BasePage';
import useBookExcerptContext from '../../hooks/useBookExcerptContext';
import BookExcerpt from './BookExcerpt';
import useTagContext from '../../hooks/useTagContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import BookExcerptDialog from './Dialogs/BookExcerptDialog';

const BookExcerpts = () => {
    const [isCreateBookExcerptDialogOpen, setIsCreateBookExcerptDialogOpen] = useState(false);

    const { isLoading: isLoadingBookExcerpt, getBookExcerpts, bookExcerpts } = useBookExcerptContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const isLoading = isLoadingBookExcerpt || isLoadingTag;

    useEffect(() => {
        if (bookExcerpts === undefined && !isLoadingBookExcerpt) getBookExcerpts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookExcerpts, getBookExcerpts]);

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
                            setIsCreateBookExcerptDialogOpen(true);
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
                        {bookExcerpts?.map(bookExcerpt => (
                            <BookExcerpt key={bookExcerpt.id} bookExcerpt={bookExcerpt} />
                        ))}
                    </Grid>
                </Box>
                {isCreateBookExcerptDialogOpen && <BookExcerptDialog onClose={() => setIsCreateBookExcerptDialogOpen(false)} />}
            </Box>
        </BasePage>
    );
};

export default BookExcerpts;
