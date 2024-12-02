import { Box, Container, Grid2 as Grid } from '@mui/material';
import { useEffect } from 'react';
import useUserAPI from '../../hooks/useUserAPI';
import BasePage from '../../components/BasePage';
import useMemoContext from '../../hooks/useMemoContext';
import Memo from './Memo';
import useTagContext from '../../hooks/useTagContext';

const Memos = () => {
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
            <Box sx={{ pt: 8, px: 1 }}>
                {/* <WineMemoForm setWineMemos={setWineMemos} /> */}
                <Container sx={{ pt: 2, pb: 4 }} maxWidth='lg'>
                    <Grid container spacing={4}>
                        {memos?.map(memo => (
                            <Memo key={memo.id} memo={memo} />
                        ))}
                    </Grid>
                </Container>
            </Box>
        </BasePage>
    );
};

export default Memos;
