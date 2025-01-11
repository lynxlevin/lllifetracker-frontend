import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import ArchiveIcon from '@mui/icons-material/Archive';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import useAmbitionContext from '../../../hooks/useAmbitionContext';
import type { ObjectiveWithActions } from '../../../types/objective';
import ObjectiveDialog from '../Dialogs/ObjectiveDialog';
import ActionDialog from '../Dialogs/ActionDialog';
import LinkActionsDialog from '../Dialogs/LinkActionsDialog';

interface ObjectiveMenuProps {
    objective: ObjectiveWithActions;
}

type DialogType = 'Edit' | 'Archive' | 'AddAction' | 'LinkActions';

const ObjectiveMenu = ({ objective }: ObjectiveMenuProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const open = Boolean(anchorEl);

    const { archiveObjective } = useAmbitionContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <ObjectiveDialog onClose={() => setOpenedDialog(undefined)} objective={objective} />;
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            archiveObjective(objective.id);
                            setOpenedDialog(undefined);
                        }}
                        title='Archive Objective'
                        message='This Objective will be permanently archived. (Linked Ambitions/Actions will not be archived). Would you like to proceed?'
                        actionName='Archive'
                    />
                );
            case 'AddAction':
                return <ActionDialog onClose={() => setOpenedDialog(undefined)} objective={objective} />;
            case 'LinkActions':
                return <LinkActionsDialog onClose={() => setOpenedDialog(undefined)} objective={objective} />;
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(undefined);
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                color='primary'
                sx={{ position: 'absolute', top: 0, right: 0 }}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
            >
                <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                <MenuItem
                    onClick={() => {
                        setOpenedDialog('Edit');
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText>Edit Objective</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpenedDialog('Archive');
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <ArchiveIcon />
                    </ListItemIcon>
                    <ListItemText>Archive Objective</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpenedDialog('AddAction');
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText>Add Action</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpenedDialog('LinkActions');
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <LinkIcon />
                    </ListItemIcon>
                    <ListItemText>Link/Unlink Actions</ListItemText>
                </MenuItem>
            </Menu>
            {openedDialog && getDialog()}
        </>
    );
};

export default ObjectiveMenu;
