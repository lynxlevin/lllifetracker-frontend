import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';

interface ObjectiveMenuProps {
    handleAddAction: () => void;
}

const ObjectiveMenu = ({ handleAddAction }: ObjectiveMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const open = Boolean(anchorEl);
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
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <LinkIcon />
                    </ListItemIcon>
                    <ListItemText>Link/Unlink Actions</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default ObjectiveMenu;
