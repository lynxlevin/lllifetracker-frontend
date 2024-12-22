import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import type { ObjectiveWithLinks } from '../../../types/objective';
import ObjectiveDialog from '../Dialogs/ObjectiveDialog';

interface ObjectiveMenuProps {
    objective: ObjectiveWithLinks;
}

type DialogType = 'Edit';

const ObjectiveMenu = ({ objective }: ObjectiveMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const open = Boolean(anchorEl);
    // const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <ObjectiveDialog onClose={() => setOpenedDialog(undefined)} objective={objective} />;
            // case 'Ambition':
            //     return <AmbitionDialog onClose={closeAllDialogs} ambition={selectedAmbition} />;
            // case 'Objective':
            //     return <ObjectiveDialog onClose={closeAllDialogs} ambition={selectedAmbition} objective={selectedObjective} />;
            // case 'Action':
            //     return <ActionDialog onClose={closeAllDialogs} objective={selectedObjective} action={selectedAction} />;
            // case 'LinkObjectives':
            //     return <LinkObjectivesDialog onClose={closeAllDialogs} ambition={selectedAmbition!} />;
            // case 'LinkActions':
            //     return <LinkActionsDialog onClose={closeAllDialogs} objective={selectedObjective!} />;
        }
    };

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
                        setOpenedDialog('Edit');
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText>Edit Objective</ListItemText>
                </MenuItem>
                {/* <MenuItem
                    onClick={() => {
                        setIsConfirmationDialogOpen(true);
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
                </MenuItem> */}
            </Menu>
            {openedDialog && getDialog()}
            {/* {isConfirmationDialogOpen && (
                <ConfirmationDialog
                    onClose={() => setIsConfirmationDialogOpen(false)}
                    handleSubmit={() => {
                        handleDeleteObjective();
                        setIsConfirmationDialogOpen(false);
                    }}
                    title={deleteConfirmationTitle}
                    message={deleteConfirmationMessage}
                    actionName='Delete'
                />
            )} */}
        </>
    );
};

export default ObjectiveMenu;
