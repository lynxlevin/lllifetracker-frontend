import { css } from '@emotion/react';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import { Box, Card, CardContent, Chip, Grid2 as Grid, IconButton, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { memo, useState } from 'react';
import type { MissionMemo as MissionMemoType } from '../../types/mission_memo';
import MissionMemoDialog from './Dialogs/MissionMemoDialog';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import useMissionMemoContext from '../../hooks/useMissionMemoContext';

interface MissionMemoProps {
    missionMemo: MissionMemoType;
}
type DialogType = 'Edit' | 'Delete' | 'Archive' | 'Accomplish';

const MissionMemo = ({ missionMemo }: MissionMemoProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { deleteMissionMemo, archiveMissionMemo, accomplishMissionMemo } = useMissionMemoContext();

    const isAccomplished = missionMemo.accomplished_at !== null;

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <MissionMemoDialog onClose={() => setOpenedDialog(undefined)} missionMemo={missionMemo} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            deleteMissionMemo(missionMemo.id);
                            setOpenedDialog(undefined);
                        }}
                        title='Delete Mission Memo'
                        message='This Mission Memo will be permanently deleted. (Linked Tags will not be deleted).'
                        actionName='Delete'
                    />
                );
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            archiveMissionMemo(missionMemo.id);
                            setOpenedDialog(undefined);
                        }}
                        title='Archive Mission Memo'
                        message='This Mission Memo will be archived.'
                        actionName='Archive'
                    />
                );
            case 'Accomplish':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            accomplishMissionMemo(missionMemo.id);
                            setOpenedDialog(undefined);
                        }}
                        title='Accomplish Mission Memo'
                        message='This Mission Memo will be marked as accomplished.'
                        actionName='Accomplish'
                    />
                );
        }
    };

    return (
        <StyledGrid size={12} isAccomplished={isAccomplished} isArchived={missionMemo.archived}>
            <Card className='card'>
                <CardContent>
                    <div className='relative-div'>
                        <Typography>{format(missionMemo.date, 'yyyy-MM-dd E')}</Typography>
                        <Typography className='mission-memo-title'>{missionMemo.title}</Typography>
                        <IconButton className='edit-button' onClick={() => setOpenedDialog('Edit')}>
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            className='accomplish-button'
                            onClick={() => setOpenedDialog('Accomplish')}
                            disabled={isAccomplished || missionMemo.archived}
                        >
                            <CheckCircleIcon />
                        </IconButton>
                        <IconButton className='archive-button' onClick={() => setOpenedDialog('Archive')} disabled={isAccomplished || missionMemo.archived}>
                            <ArchiveIcon />
                        </IconButton>
                        <IconButton className='delete-button' onClick={() => setOpenedDialog('Delete')}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                    <Box className='tags-div'>
                        {missionMemo.tags.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: `${tag.tag_type.toLowerCase()}s.100` }} />
                        ))}
                    </Box>
                    <TextField
                        value={missionMemo.text}
                        multiline
                        maxRows={12}
                        fullWidth
                        disabled
                        sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)' } }}
                    />
                </CardContent>
            </Card>
            {openedDialog && getDialog()}
        </StyledGrid>
    );
};

const StyledGrid = styled(Grid)((props: { isAccomplished: boolean; isArchived: boolean }) => {
    const accomplishedColor = props.isAccomplished
        ? css`
        &:disabled {
            color: rgb(0, 150, 136);
        }
    `
        : css``;

    const archivedColor = props.isArchived
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

        .mission-memo-title {
            padding-top: 8px;
            padding-bottom: 16px;
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
            margin-bottom: 16px;
        }
`;
});

export default memo(MissionMemo);
