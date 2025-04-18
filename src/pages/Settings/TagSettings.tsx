import { Box, Grid2 as Grid, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import BasePage from '../../components/BasePage';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import useTagContext from '../../hooks/useTagContext';
import TagDialog from './Dialogs/TagDialog';
import TagItem from './TagItem';

type DialogType = 'Create';

const TagSettings = () => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { isLoading, getTags, tags } = useTagContext();

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
        <BasePage isLoading={isLoading} pageName='Settings'>
            <Box sx={{ pt: 0.5 }}>
                <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                    <IconButton
                        onClick={() => {
                            setOpenedDialog('Create');
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
                        {tags
                            ?.filter(tag => tag.tag_type === 'Plain')
                            .map(tag => (
                                <TagItem key={tag.id} tag={tag} />
                            ))}
                    </Grid>
                </Box>
                {openedDialog && getDialog()}
            </Box>
        </BasePage>
    );
};

export default TagSettings;
