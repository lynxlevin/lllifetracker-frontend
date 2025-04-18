import { Card, Grid2 as Grid, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import useTagContext from '../../hooks/useTagContext';
import TagDialog from './Dialogs/TagDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Tag } from '../../types/tag';
import ConfirmationDialog from '../../components/ConfirmationDialog';

type DialogType = 'Edit' | 'Delete';

interface TagItemProps {
    tag: Tag;
}

const TagItem = ({ tag }: TagItemProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { deleteTag } = useTagContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <TagDialog onClose={() => setOpenedDialog(undefined)} tag={tag} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            deleteTag(tag.id);
                            setOpenedDialog(undefined);
                        }}
                        title='タグ：削除'
                        message={`「${tag.name}」を削除します。`}
                        actionName='削除する'
                    />
                );
        }
    };
    return (
        <Grid key={tag.id} size={12}>
            <Card sx={{ p: 0.5 }}>
                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography pl={1}>{tag.name}</Typography>
                    <Stack direction='row' alignItems='center' pr={1}>
                        <IconButton onClick={() => setOpenedDialog('Edit')}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => setOpenedDialog('Delete')}>
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                </Stack>
            </Card>
            {openedDialog && getDialog()}
        </Grid>
    );
};

export default TagItem;
