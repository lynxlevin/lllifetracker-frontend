import { Badge, Box, Grid, IconButton, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../../components/BasePage';
import useDiaryContext from '../../../hooks/useDiaryContext';
import Diary from './Diary';
import useTagContext from '../../../hooks/useTagContext';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DiaryDialog from './Dialogs/DiaryDialog';
import DiaryFilterDialog from './Dialogs/DiaryFilterDialog';
import { Tag } from '../../../types/tag';

type DialogType = 'Create' | 'Filter';

const Diaries = () => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [tagsFilter, setTagsFilter] = useState<Tag[]>([]);

    const { isLoading: isLoadingDiary, getDiaries, diaries } = useDiaryContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const isLoading = isLoadingDiary || isLoadingTag;

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <DiaryDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Filter':
                return <DiaryFilterDialog onClose={() => setOpenedDialog(undefined)} tagsFilter={tagsFilter} setTagsFilter={setTagsFilter} />;
        }
    };

    const filteredDiaries = useMemo(() => {
        if (tagsFilter.length === 0) return diaries ?? [];
        return diaries?.filter(diary => diary.tags.some(tag => tagsFilter.map(tag => tag.id).includes(tag.id))) ?? [];
    }, [diaries, tagsFilter]);

    useEffect(() => {
        if (diaries === undefined && !isLoadingDiary) getDiaries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [diaries, getDiaries]);

    useEffect(() => {
        if (tags === undefined && !isLoadingTag) getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags, getTags]);
    return (
        <BasePage isLoading={isLoading} pageName="Journals">
            <Box sx={{ pt: 0.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="end" mt={2}>
                    <Badge badgeContent={tagsFilter.length} color="primary" overlap="circular">
                        <IconButton
                            onClick={() => {
                                setOpenedDialog('Filter');
                            }}
                        >
                            <FilterAltIcon />
                        </IconButton>
                    </Badge>
                    <IconButton
                        onClick={() => {
                            setOpenedDialog('Create');
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Stack>
                <Box sx={{ pb: 4 }}>
                    <Grid container spacing={2}>
                        {filteredDiaries.map(diary => (
                            <Diary key={diary.id} diary={diary} />
                        ))}
                    </Grid>
                </Box>
                {openedDialog && getDialog()}
            </Box>
        </BasePage>
    );
};

export default Diaries;
