import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../../../components/ConfirmationDialog';

interface AmbitionMenuProps {
    handleEditAmbition: () => void;
    handleDeleteAmbition: () => void;
    handleAddObjective: () => void;
    handleLinkObjectives: () => void;
}

const AmbitionMenu = ({ handleEditAmbition, handleDeleteAmbition, handleAddObjective, handleLinkObjectives }: AmbitionMenuProps) => {
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const open = Boolean(anchorEl);

    const deleteConfirmationTitle = 'Delete Ambition';
    const deleteConfirmationMessage = 'This Ambition will be permanently deleted. (Linked Objectives/Actions will not be deleted). Would you like to proceed?';
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
                        handleEditAmbition();
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText>Edit Ambition</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setIsConfirmationDialogOpen(true);
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>Delete Ambition</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleAddObjective();
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText>Add Objective</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleLinkObjectives();
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <LinkIcon />
                    </ListItemIcon>
                    <ListItemText>Link/Unlink Objectives</ListItemText>
                </MenuItem>
            </Menu>
            {isConfirmationDialogOpen && (
                <ConfirmationDialog
                    onClose={() => setIsConfirmationDialogOpen(false)}
                    handleSubmit={() => {
                        handleDeleteAmbition();
                        setIsConfirmationDialogOpen(false);
                    }}
                    title={deleteConfirmationTitle}
                    message={deleteConfirmationMessage}
                    actionName='Delete'
                />
            )}
        </>
    );
};

export default AmbitionMenu;
