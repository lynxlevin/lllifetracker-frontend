import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Card, CardContent, Chip, Grid, IconButton, Typography } from '@mui/material';
import { format } from 'date-fns';
import { memo, useState } from 'react';
import type { ReadingNote as ReadingNoteType } from '../../../types/reading_note';
import ReadingNoteDialog from './Dialogs/ReadingNoteDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import useReadingNoteContext from '../../../hooks/useReadingNoteContext';
import useTagContext from '../../../hooks/useTagContext';

interface ReadingNoteProps {
    readingNote: ReadingNoteType;
}
type DialogType = 'Edit' | 'Delete';

const ReadingNote = ({ readingNote }: ReadingNoteProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { deleteReadingNote } = useReadingNoteContext();
    const { getTagColor } = useTagContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <ReadingNoteDialog onClose={() => setOpenedDialog(undefined)} readingNote={readingNote} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            deleteReadingNote(readingNote.id);
                            setOpenedDialog(undefined);
                        }}
                        title="Delete ReadingNote"
                        message="This ReadingNote will be permanently deleted. (Linked Tags will not be deleted)."
                        actionName="Delete"
                    />
                );
        }
    };

    return (
        <StyledGrid size={12}>
            <Card className="card">
                <CardContent>
                    <div className="relative-div">
                        <Typography>{format(readingNote.date, 'yyyy-MM-dd E')}</Typography>
                        <Typography className="reading-note-title" variant="h6">
                            {readingNote.title}({readingNote.page_number})
                        </Typography>
                        <IconButton className="edit-button" onClick={() => setOpenedDialog('Edit')}>
                            <EditIcon />
                        </IconButton>
                        <IconButton className="delete-button" onClick={() => setOpenedDialog('Delete')}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                    <Box className="tags-div">
                        {readingNote.tags.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                        ))}
                    </Box>
                    <div className="line-clamp">{readingNote.text}</div>
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

    .reading-note-title {
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

export default memo(ReadingNote);
