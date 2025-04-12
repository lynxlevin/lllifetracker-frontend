import { Box, Grid2 as Grid, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import BasePage from '../../../components/BasePage';
import useDiaryContext from '../../../hooks/useDiaryContext';
import Diary from './Diary';
import useTagContext from '../../../hooks/useTagContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DiaryDialog from './Dialogs/DiaryDialog';

const Diaries = () => {
    const [isCreateDiaryDialogOpen, setIsCreateDiaryDialogOpen] = useState(false);

    const { isLoading: isLoadingDiary, getDiaries, diaries } = useDiaryContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const isLoading = isLoadingDiary || isLoadingTag;

    useEffect(() => {
        if (diaries === undefined && !isLoadingDiary) getDiaries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [diaries, getDiaries]);

    useEffect(() => {
        if (tags === undefined && !isLoadingTag) getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags, getTags]);
    return (
        <BasePage isLoading={isLoading} pageName='Journals'>
            <Box sx={{ pt: 0.5 }}>
                <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                    <IconButton
                        onClick={() => {
                            setIsCreateDiaryDialogOpen(true);
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
                        {diaries?.map(diary => (
                            <Diary key={diary.id} diary={diary} />
                        ))}
                    </Grid>
                </Box>
                {isCreateDiaryDialogOpen && <DiaryDialog onClose={() => setIsCreateDiaryDialogOpen(false)} />}
            </Box>
        </BasePage>
    );
};

export default Diaries;
