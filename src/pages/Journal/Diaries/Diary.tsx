import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Card, CardContent, Chip, Grid2 as Grid, IconButton, Rating, Typography } from '@mui/material';
import { format } from 'date-fns';
import { memo, useState } from 'react';
import type { Diary as DiaryType } from '../../../types/diary';
import DiaryDialog from './Dialogs/DiaryDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import useDiaryContext from '../../../hooks/useDiaryContext';
import useTagContext from '../../../hooks/useTagContext';

interface DiaryProps {
    diary: DiaryType;
}
type DialogType = 'Edit' | 'Delete';

const Diary = ({ diary }: DiaryProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { deleteDiary } = useDiaryContext();
    const { getTagColor } = useTagContext();

    const deleteConfirmationTitle = 'Delete Diary';
    const deleteConfirmationMessage = 'This Diary will be permanently deleted. (Linked Tags will not be deleted). Would you like to proceed?';

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <DiaryDialog onClose={() => setOpenedDialog(undefined)} diary={diary} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            deleteDiary(diary.id);
                            setOpenedDialog(undefined);
                        }}
                        title={deleteConfirmationTitle}
                        message={deleteConfirmationMessage}
                        actionName='Delete'
                    />
                );
        }
    };

    return (
        <StyledGrid size={12}>
            <Card className='card'>
                <CardContent>
                    <div className='relative-div'>
                        <Typography>{format(diary.date, 'yyyy-MM-dd E')}</Typography>
                        <Rating value={diary.score} readOnly />
                        <IconButton className='edit-button' onClick={() => setOpenedDialog('Edit')}>
                            <EditIcon />
                        </IconButton>
                        <IconButton className='delete-button' onClick={() => setOpenedDialog('Delete')}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                    <Box className='tags-div'>
                        {diary.tags.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                        ))}
                    </Box>
                    <div className='scroll-shadows'>{diary.text}</div>
                </CardContent>
            </Card>
            {openedDialog && getDialog()}
        </StyledGrid>
    );
};

const StyledGrid = styled(Grid)`
    .card {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        text-align: left;
    }

    .relative-div {
        position: relative;
    }

    .score-badge {
        position: absolute;
        top: 10px;
        right: 180px;
    }

    .edit-button {
        position: absolute;
        top: -8px;
        right: 28px;
    }

    .delete-button {
        position: absolute;
        top: -8px;
        right: -12px;
    }

    .tags-div {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 12px;
    }
`;

export default memo(Diary);
