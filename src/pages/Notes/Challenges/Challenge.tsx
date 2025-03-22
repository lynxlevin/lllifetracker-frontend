import { css } from '@emotion/react';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import { Box, Card, CardContent, Chip, Grid2 as Grid, IconButton, Typography } from '@mui/material';
import { format } from 'date-fns';
import { memo, useState } from 'react';
import type { Challenge as ChallengeType } from '../../../types/challenge';
import ChallengeDialog from './Dialogs/ChallengeDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import useChallengeContext from '../../../hooks/useChallengeContext';
import useTagContext from '../../../hooks/useTagContext';

interface ChallengeProps {
    challenge: ChallengeType;
}
type DialogType = 'Edit' | 'Delete' | 'Archive' | 'Accomplish';

const Challenge = ({ challenge }: ChallengeProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { deleteChallenge, archiveChallenge, accomplishChallenge } = useChallengeContext();
    const { getTagColor } = useTagContext();

    const isDisabled = challenge.accomplished_at !== null || challenge.archived;

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <ChallengeDialog onClose={() => setOpenedDialog(undefined)} challenge={challenge} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            deleteChallenge(challenge.id);
                            setOpenedDialog(undefined);
                        }}
                        title='Delete Challenge'
                        message='This Challenge will be permanently deleted. (Linked Tags will not be deleted).'
                        actionName='Delete'
                    />
                );
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            archiveChallenge(challenge.id);
                            setOpenedDialog(undefined);
                        }}
                        title='Archive Challenge'
                        message='This Challenge will be archived.'
                        actionName='Archive'
                    />
                );
            case 'Accomplish':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            accomplishChallenge(challenge.id);
                            setOpenedDialog(undefined);
                        }}
                        title='Accomplish Challenge'
                        message='This Challenge will be marked as accomplished.'
                        actionName='Accomplish'
                    />
                );
        }
    };

    return (
        <StyledGrid size={12} challenge={challenge}>
            <Card className='card'>
                <CardContent>
                    <div className='relative-div'>
                        <Typography>{format(challenge.date, 'yyyy-MM-dd E')}</Typography>
                        <Typography className='challenge-title' variant='h6'>
                            {challenge.title}
                        </Typography>
                        <IconButton className='edit-button' onClick={() => setOpenedDialog('Edit')}>
                            <EditIcon />
                        </IconButton>
                        <IconButton className='accomplish-button' onClick={() => setOpenedDialog('Accomplish')} disabled={isDisabled}>
                            <CheckCircleIcon />
                        </IconButton>
                        <IconButton className='archive-button' onClick={() => setOpenedDialog('Archive')} disabled={isDisabled}>
                            <ArchiveIcon />
                        </IconButton>
                        <IconButton className='delete-button' onClick={() => setOpenedDialog('Delete')}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                    <Box className='tags-div'>
                        {challenge.tags.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                        ))}
                    </Box>
                    <div className='scroll-shadows'>{challenge.text}</div>
                </CardContent>
            </Card>
            {openedDialog && getDialog()}
        </StyledGrid>
    );
};

const StyledGrid = styled(Grid)((props: { challenge: ChallengeType }) => {
    const accomplishedColor =
        props.challenge.accomplished_at !== null
            ? css`
        &:disabled {
            color: rgb(0, 150, 136);
        }
    `
            : css``;

    const archivedColor = props.challenge.archived
        ? css`
        background-color: #f0f0f0;
    `
        : css``;

    return css`
        .card {
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
            text-align: left;
            ${archivedColor};
        }

        .relative-div {
            position: relative;
        }

        .challenge-title {
            padding-top: 8px;
            padding-bottom: 8px;
        }

        .edit-button {
            position: absolute;
            top: -8px;
            right: 108px;
        }

        .delete-button {
            position: absolute;
            top: -8px;
            right: -12px;
        }

        .accomplish-button {
            position: absolute;
            top: -8px;
            right: 68px;
            ${accomplishedColor};
        }

        .archive-button {
            position: absolute;
            top: -8px;
            right: 28px;
        }

        .tags-div {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-bottom: 12px;
        }
`;
});

export default memo(Challenge);
