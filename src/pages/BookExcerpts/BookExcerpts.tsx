import { Box, Grid2 as Grid, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useUserAPI from '../../hooks/useUserAPI';
import BasePage from '../../components/BasePage';
import { useNavigate } from 'react-router-dom';
import useBookExcerptContext from '../../hooks/useBookExcerptContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookExcerpt from './BookExcerpt';
import useTagContext from '../../hooks/useTagContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import BookExcerptDialog from './Dialogs/BookExcerptDialog';

const BookExcerpts = () => {
    const [isCreateBookExcerptDialogOpen, setIsCreateBookExcerptDialogOpen] = useState(false);
    const navigate = useNavigate();

    const { isLoggedIn } = useUserAPI();
    const { isLoading: isLoadingBookExcerpt, getBookExcerpts, bookExcerpts } = useBookExcerptContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const isLoading = isLoadingBookExcerpt || isLoadingTag;

    useEffect(() => {
        if (bookExcerpts === undefined && !isLoadingBookExcerpt && isLoggedIn) getBookExcerpts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookExcerpts, getBookExcerpts]);

    useEffect(() => {
        if (tags === undefined && !isLoadingTag && isLoggedIn) getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags, getTags]);
    return (
        <BasePage isLoading={isLoading} pageName='Memos'>
            <Box sx={{ position: 'relative', pt: 0.5 }}>
                <IconButton
                    onClick={() => {
                        navigate('/mission-memos');
                    }}
                    aria-label='mission-memos'
                    color='primary'
                    sx={{ position: 'absolute', top: -20, left: 0, fontSize: 18, zIndex: 100 }}
                >
                    課題
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                    <Typography variant='h5'>本の抜粋</Typography>
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
                <Box sx={{ pt: 2, pb: 4 }}>
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
