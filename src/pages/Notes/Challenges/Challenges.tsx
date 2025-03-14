import { Box, Grid2 as Grid, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import BasePage from '../../../components/BasePage';
import useChallengeContext from '../../../hooks/useChallengeContext';
import Challenge from './Challenge';
import useTagContext from '../../../hooks/useTagContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ChallengeDialog from './Dialogs/ChallengeDialog';

const Challenges = () => {
    const [isCreateChallengeDialogOpen, setIsCreateChallengeDialogOpen] = useState(false);

    const { isLoading: isLoadingChallenge, getChallenges, challenges } = useChallengeContext();
    const { isLoading: isLoadingTag, getTags, tags } = useTagContext();

    const isLoading = isLoadingChallenge || isLoadingTag;

    useEffect(() => {
        if (challenges === undefined && !isLoadingChallenge) getChallenges();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [challenges, getChallenges]);

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
                            setIsCreateChallengeDialogOpen(true);
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
                        {challenges?.map(challenge => (
                            <Challenge key={challenge.id} challenge={challenge} />
                        ))}
                    </Grid>
                </Box>
                {isCreateChallengeDialogOpen && <ChallengeDialog onClose={() => setIsCreateChallengeDialogOpen(false)} />}
            </Box>
        </BasePage>
    );
};

export default Challenges;
