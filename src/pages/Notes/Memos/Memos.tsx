import { Box, Grid2 as Grid, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import BasePage from '../../../components/BasePage';
import useMemoContext from '../../../hooks/useMemoContext';
import Memo from './Memo';
import useTagContext from '../../../hooks/useTagContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MemoDialog from './Dialogs/MemoDialog';

const Memos = () => {
    const [isCreateMemoDialogOpen, setIsCreateMemoDialogOpen] = useState(false);

    const { isLoading: isLoadingMemo, getMemos, memos } = useMemoContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const isLoading = isLoadingMemo || isLoadingTag;

    useEffect(() => {
        if (memos === undefined && !isLoadingMemo) getMemos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [memos, getMemos]);

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
                            setIsCreateMemoDialogOpen(true);
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
