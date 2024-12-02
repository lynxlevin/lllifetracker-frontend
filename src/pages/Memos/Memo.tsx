import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, CardContent, Chip, Grid2 as Grid, IconButton, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { memo as reactMemo, useState } from 'react';
import type { Memo as MemoType } from '../../types/memo';
import MemoDialog from './MemoDialog';

interface MemoProps {
    memo: MemoType;
}

const Memo = ({ memo }: MemoProps) => {
    const [isEditMemoDialogOpen, setIsEditMemoDialogOpen] = useState(false);

    return (
        <StyledGrid size={12}>
            <Card className='card'>
                <CardContent>
                    <div className='relative-div'>
                        <Typography className='diary-date'>{format(memo.date, 'yyyy-MM-dd E')}</Typography>
                        <Typography className='memo-title'>{memo.title}</Typography>
                        <IconButton className='edit-button' onClick={() => setIsEditMemoDialogOpen(true)}>
                            <EditIcon />
                        </IconButton>
                    </div>
                    <Box className='tags-div'>
                        {memo.tags.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: `${tag.tag_type.toLowerCase()}s.100` }} />
                        ))}
                    </Box>
                    <TextField
                        value={memo.text}
                        multiline
                        maxRows={12}
                        fullWidth
                        disabled
                        sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)' } }}
                    />
                </CardContent>
            </Card>
            {isEditMemoDialogOpen && (
                <MemoDialog
                    onClose={() => {
                        setIsEditMemoDialogOpen(false);
                    }}
                    memo={memo}
                />
            )}
        </StyledGrid>
    );
};

const StyledGrid = styled(Grid)`
    .card {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .relative-div {
        position: relative;
    }

    .memo-title {
        padding-top: 8px;
        padding-bottom: 16px;
    }

    .edit-button {
        position: absolute;
        top: -8px;
        right: -7px;
    }

    .tags-div {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 16px;
    }
`;

export default reactMemo(Memo);
