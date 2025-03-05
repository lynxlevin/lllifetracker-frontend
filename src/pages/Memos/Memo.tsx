import { css } from '@emotion/react';
import styled from '@emotion/styled';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Card, CardContent, Chip, Grid2 as Grid, IconButton, Typography } from '@mui/material';
import { format } from 'date-fns';
import { memo as reactMemo, useState } from 'react';
import type { Memo as MemoType } from '../../types/memo';
import MemoDialog from './Dialogs/MemoDialog';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import useMemoContext from '../../hooks/useMemoContext';
import { orange } from '@mui/material/colors';

interface MemoProps {
    memo: MemoType;
}
type DialogType = 'Edit' | 'Delete';

const Memo = ({ memo }: MemoProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { switchMemoFavorite, deleteMemo } = useMemoContext();

    const deleteConfirmationTitle = 'Delete Memo';
    const deleteConfirmationMessage = 'This Memo will be permanently deleted. (Linked Tags will not be deleted). Would you like to proceed?';

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <MemoDialog onClose={() => setOpenedDialog(undefined)} memo={memo} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            deleteMemo(memo.id);
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
        <StyledGrid size={12} isFavorite={memo.favorite}>
            <Card className='card'>
                <CardContent>
                    <div className='relative-div'>
                        <Typography>{format(memo.date, 'yyyy-MM-dd E')}</Typography>
                        <Typography className='memo-title' variant='h6'>
                            {memo.title}
                        </Typography>
                        <IconButton className='favorite-button' onClick={() => switchMemoFavorite(memo)}>
                            <StarIcon />
                        </IconButton>
                        <IconButton className='edit-button' onClick={() => setOpenedDialog('Edit')}>
                            <EditIcon />
                        </IconButton>
                        <IconButton className='delete-button' onClick={() => setOpenedDialog('Delete')}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                    <Box className='tags-div'>
                        {memo.tags.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: `${tag.tag_type.toLowerCase()}s.100` }} />
                        ))}
                    </Box>
                    <div className='scroll-shadows'>{memo.text}</div>
                </CardContent>
            </Card>
            {openedDialog && getDialog()}
        </StyledGrid>
    );
};

const StyledGrid = styled(Grid)((props: { isFavorite: boolean }) => {
    const favoriteColor = props.isFavorite
        ? css`
        color: ${orange[500]};
    `
        : css`
        color: lightgrey;
    `;

    return css`
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

    .memo-title {
        padding-top: 8px;
        padding-bottom: 8px;
    }

    .favorite-button {
        position: absolute;
        top: -8px;
        right: 68px;
        ${favoriteColor};
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
});

export default reactMemo(Memo);
