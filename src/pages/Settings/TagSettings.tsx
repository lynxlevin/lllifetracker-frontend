import { Box, CircularProgress, Grid, IconButton, Card, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { Tag } from '../../types/tag';
import useTagContext from '../../hooks/useTagContext';
import TagDialog from './Dialogs/TagDialog';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import BasePage from '../../components/BasePage';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

type DialogType = 'Create';

const TagSettings = () => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const { isLoading, getTags, tags } = useTagContext();
    const navigate = useNavigate();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <TagDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        if (tags === undefined && !isLoading) getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags, getTags]);
    return (
        <BasePage
            pageName="Settings"
            breadCrumbAction={() => {
                navigate('/settings');
                window.scroll({ top: 0 });
            }}
        >
            <Box sx={{ pt: 0.5 }}>
                <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                    <IconButton
                        onClick={() => {
                            setOpenedDialog('Create');
                        }}
                        aria-label="add"
                        color="primary"
                        sx={{ position: 'absolute', top: 0, right: 0 }}
                    >
                        <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                </Box>
                <Box sx={{ pt: 2, pb: 4, mt: 6 }}>
                    {isLoading ? (
                        <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                    ) : (
                        <Grid container spacing={2}>
                            {tags?.filter(tag => tag.type === 'Plain').map(tag => <TagItem key={tag.id} tag={tag} />)}
                        </Grid>
                    )}
                </Box>
                {openedDialog && getDialog()}
            </Box>
        </BasePage>
    );
};

type TagItemDialogType = 'Edit' | 'Delete';

interface TagItemProps {
    tag: Tag;
}

const TagItem = ({ tag }: TagItemProps) => {
    const [openedDialog, setOpenedDialog] = useState<TagItemDialogType>();

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
                        title="タグ：削除"
                        message={`${tag.name}タグを削除します。`}
                        actionName="削除"
                        actionColor="error"
                    />
                );
        }
    };
    return (
        <Grid key={tag.id} size={12}>
            <Card sx={{ p: 0.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography pl={1}>{tag.name}</Typography>
                    <Stack direction="row" alignItems="center" pr={1}>
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

export default TagSettings;
