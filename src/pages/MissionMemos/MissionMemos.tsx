import { Box, Container, Grid2 as Grid, IconButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useUserAPI from '../../hooks/useUserAPI';
import BasePage from '../../components/BasePage';
import { useNavigate } from 'react-router-dom';
import useMissionMemoContext from '../../hooks/useMissionMemoContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MissionMemo from './MissionMemo';
import useTagContext from '../../hooks/useTagContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MissionMemoDialog from './Dialogs/MissionMemoDialog';

const MissionMemos = () => {
    const [isCreateMissionMemoDialogOpen, setIsCreateMissionMemoDialogOpen] = useState(false);
    const navigate = useNavigate();

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
            <Box sx={{ position: 'relative', pt: 0.5 }}>
                <IconButton
                    onClick={() => {
                        navigate('/memos');
                    }}
                    aria-label='memos'
                    color='primary'
                    sx={{ position: 'absolute', top: -20, left: 0, fontSize: 18, zIndex: 100 }}
                >
                    メモ
                    <ArrowBackIcon />
                </IconButton>
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
                <Container sx={{ pt: 2, pb: 4 }} maxWidth='lg'>
                    <Grid container spacing={4}>
                        {missionMemos?.map(missionMemo => (
                            <MissionMemo key={missionMemo.id} missionMemo={missionMemo} />
                        ))}
                    </Grid>
                </Container>
                {isCreateMissionMemoDialogOpen && <MissionMemoDialog onClose={() => setIsCreateMissionMemoDialogOpen(false)} />}
            </Box>
        </BasePage>
    );
};

export default MissionMemos;
