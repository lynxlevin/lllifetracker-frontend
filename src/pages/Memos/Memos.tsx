import { Box, Grid2 as Grid, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useUserAPI from '../../hooks/useUserAPI';
import BasePage from '../../components/BasePage';
import useMemoContext from '../../hooks/useMemoContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Memo from './Memo';
import useTagContext from '../../hooks/useTagContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MemoDialog from './Dialogs/MemoDialog';
import { useNavigate } from 'react-router-dom';

const Memos = () => {
    const [isCreateMemoDialogOpen, setIsCreateMemoDialogOpen] = useState(false);
    const navigate = useNavigate();

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
            <Box sx={{ position: 'relative', pt: 0.5 }}>
                <IconButton
                    onClick={() => {
                        navigate('/mission-memos');
                    }}
                    aria-label='mission-memos'
                    color='primary'
                    sx={{ position: 'absolute', top: -20, right: 0, fontSize: 18, zIndex: 100 }}
                >
                    課題
                    <ArrowForwardIcon />
                </IconButton>
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
                <Box sx={{ pt: 2, pb: 4 }}>
                    <Grid container spacing={2}>
                        {memos?.map(memo => (
                            <Memo key={memo.id} memo={memo} />
                        ))}
                    </Grid>
                </Box>
                {isCreateMemoDialogOpen && <MemoDialog onClose={() => setIsCreateMemoDialogOpen(false)} />}
            </Box>
        </BasePage>
    );
};

export default Memos;
