import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationDialog from '../Dialogs/DeleteConfirmationDialog';

interface ObjectiveMenuProps {
    handleEditObjective: () => void;
    handleDeleteObjective: () => void;
    handleAddAction: () => void;
    handleLinkActions: () => void;
}

const ObjectiveMenu = ({ handleEditObjective, handleDeleteObjective, handleAddAction, handleLinkActions }: ObjectiveMenuProps) => {
    const [isDeleteConfirmationDialogOpen, setIsDeleteConfirmationDialogOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const open = Boolean(anchorEl);

    const deleteConfirmationTitle = 'Delete Objective';
    const deleteConfirmationMessage = 'This Objective will be permanently deleted. (Linked Ambitions/Actions will not be deleted). Would you like to proceed?';
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
                        handleEditObjective();
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
                        setIsDeleteConfirmationDialogOpen(true);
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>Delete Objective</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleAddAction();
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
                        handleLinkActions();
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <LinkIcon />
                    </ListItemIcon>
                    <ListItemText>Link/Unlink Actions</ListItemText>
                </MenuItem>
            </Menu>
            {isDeleteConfirmationDialogOpen && (
                <DeleteConfirmationDialog
                    onClose={() => setIsDeleteConfirmationDialogOpen(false)}
                    handleSubmit={() => {
                        handleDeleteObjective();
                        setIsDeleteConfirmationDialogOpen(false);
                    }}
                    title={deleteConfirmationTitle}
                    message={deleteConfirmationMessage}
                />
            )}
        </>
    );
};

export default ObjectiveMenu;
