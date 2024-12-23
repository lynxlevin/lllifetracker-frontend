import { css } from '@emotion/react';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import { Box, Card, CardContent, Chip, Grid2 as Grid, IconButton, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { memo, useState } from 'react';
import type { BookExcerpt as BookExcerptType } from '../../types/book_excerpt';
import BookExcerptDialog from './Dialogs/BookExcerptDialog';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import useBookExcerptContext from '../../hooks/useBookExcerptContext';

interface BookExcerptProps {
    bookExcerpt: BookExcerptType;
}
type DialogType = 'Edit' | 'Delete';

const BookExcerpt = ({ bookExcerpt }: BookExcerptProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { deleteBookExcerpt } = useBookExcerptContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <BookExcerptDialog onClose={() => setOpenedDialog(undefined)} bookExcerpt={bookExcerpt} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            deleteBookExcerpt(bookExcerpt.id);
                            setOpenedDialog(undefined);
                        }}
                        title='Delete Book Excerpt'
                        message='This Book Excerpt will be permanently deleted. (Linked Tags will not be deleted).'
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
                        <Typography>{format(bookExcerpt.date, 'yyyy-MM-dd E')}</Typography>
                        <Typography className='book-excerpt-title'>
                            {bookExcerpt.title}({bookExcerpt.page_number})
                        </Typography>
                        <IconButton className='edit-button' onClick={() => setOpenedDialog('Edit')}>
                            <EditIcon />
                        </IconButton>
                        <IconButton className='delete-button' onClick={() => setOpenedDialog('Delete')}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                    <Box className='tags-div'>
                        {bookExcerpt.tags.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: `${tag.tag_type.toLowerCase()}s.100` }} />
                        ))}
                    </Box>
                    <TextField
                        value={bookExcerpt.text}
                        multiline
                        rows={5}
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

    .book-excerpt-title {
        padding-top: 8px;
        padding-bottom: 8px;
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

export default memo(BookExcerpt);
