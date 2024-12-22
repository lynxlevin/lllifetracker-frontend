import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import type { Action } from '../../../types/action';
import useAmbitionContext from '../../../hooks/useAmbitionContext';
import ActionDialog from '../Dialogs/ActionDialog';

interface ActionMenuProps {
    action: Action;
}

type DialogType = 'Edit' | 'Delete';

const ActionMenu = ({ action }: ActionMenuProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const open = Boolean(anchorEl);

    const { deleteAction } = useAmbitionContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <ActionDialog onClose={() => setOpenedDialog(undefined)} action={action} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            deleteAction(action.id);
                            setOpenedDialog(undefined);
                        }}
                        title='Delete Action'
                        message='This Action will be permanently deleted. (Linked Ambitions/Objectives will not be deleted). Would you like to proceed?'
                        actionName='Delete'
                    />
                );
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
                    <ListItemText>Edit Action</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpenedDialog('Delete');
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>Delete Action</ListItemText>
                </MenuItem>
            </Menu>
            {openedDialog && getDialog()}
        </>
    );
};

export default ActionMenu;
