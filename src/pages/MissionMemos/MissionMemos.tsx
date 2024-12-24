import { Box, Grid2 as Grid, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useUserAPI from '../../hooks/useUserAPI';
import BasePage from '../../components/BasePage';
import useMissionMemoContext from '../../hooks/useMissionMemoContext';
import MissionMemo from './MissionMemo';
import useTagContext from '../../hooks/useTagContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MissionMemoDialog from './Dialogs/MissionMemoDialog';

const MissionMemos = () => {
    const [isCreateMissionMemoDialogOpen, setIsCreateMissionMemoDialogOpen] = useState(false);

    const { isLoggedIn } = useUserAPI();
    const { isLoading: isLoadingMissionMemo, getMissionMemos, missionMemos } = useMissionMemoContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const isLoading = isLoadingMissionMemo || isLoadingTag;

    useEffect(() => {
        if (missionMemos === undefined && !isLoadingMissionMemo && isLoggedIn) getMissionMemos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [missionMemos, getMissionMemos]);

    useEffect(() => {
        if (tags === undefined && !isLoadingTag && isLoggedIn) getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags, getTags]);
    return (
        <BasePage isLoading={isLoading} pageName='Memos'>
            <Box sx={{ pt: 0.5 }}>
                <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                    <Typography variant='h5'>課題</Typography>
                    <IconButton
                        onClick={() => {
                            setIsCreateMissionMemoDialogOpen(true);
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
                        {missionMemos?.map(missionMemo => (
                            <MissionMemo key={missionMemo.id} missionMemo={missionMemo} />
                        ))}
                    </Grid>
                </Box>
                {isCreateMissionMemoDialogOpen && <MissionMemoDialog onClose={() => setIsCreateMissionMemoDialogOpen(false)} />}
            </Box>
        </BasePage>
    );
};

export default MissionMemos;
