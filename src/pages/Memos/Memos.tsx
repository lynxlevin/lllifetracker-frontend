import { Box, Container, Grid2 as Grid, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useUserAPI from '../../hooks/useUserAPI';
import BasePage from '../../components/BasePage';
import useMemoContext from '../../hooks/useMemoContext';
import Memo from './Memo';
import useTagContext from '../../hooks/useTagContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MemoDialog from './Dialogs/MemoDialog';

const Memos = () => {
    const [isCreateMemoDialogOpen, setIsCreateMemoDialogOpen] = useState(false);

    const { isLoggedIn } = useUserAPI();
    const { isLoading: isLoadingMemo, getMemos, memos } = useMemoContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const isLoading = isLoadingMemo || isLoadingTag;

    useEffect(() => {
        if (memos === undefined && !isLoadingMemo && isLoggedIn) getMemos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memos, getMemos]);

    useEffect(() => {
        if (tags === undefined && !isLoadingTag && isLoggedIn) getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags, getTags]);
    return (
        <BasePage isLoading={isLoading} pageName='Memos'>
            <>
                <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                    <Typography variant='h5'>メモ</Typography>
                    <IconButton
                        onClick={() => {
                            setIsCreateMemoDialogOpen(true);
                        }}
                        aria-label='add'
                        color='primary'
                        sx={{ position: 'absolute', top: 0, right: 0 }}
                    >
                        <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                </Box>
                <Container sx={{ pt: 2, pb: 4 }} maxWidth='lg'>
                    <Grid container spacing={4}>
                        {memos?.map(memo => (
                            <Memo key={memo.id} memo={memo} />
                        ))}
                    </Grid>
                </Container>
                {isCreateMemoDialogOpen && <MemoDialog onClose={() => setIsCreateMemoDialogOpen(false)} />}
            </>
        </BasePage>
    );
};

export default Memos;
