import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../../../components/ConfirmationDialog';

interface ActionMenuProps {
    handleEditAction: () => void;
    handleDeleteAction: () => void;
}

const ActionMenu = ({ handleEditAction, handleDeleteAction }: ActionMenuProps) => {
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const open = Boolean(anchorEl);

    const deleteConfirmationTitle = 'Delete Action';
    const deleteConfirmationMessage = 'This Action will be permanently deleted. (Linked Ambitions/Objectives will not be deleted). Would you like to proceed?';
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
                        handleEditAction();
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText>Edit Action</ListItemText>
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
                    <ListItemText>Delete Action</ListItemText>
                </MenuItem>
            </Menu>
            {isConfirmationDialogOpen && (
                <ConfirmationDialog
                    onClose={() => setIsConfirmationDialogOpen(false)}
                    handleSubmit={() => {
                        handleDeleteAction();
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

export default ActionMenu;
