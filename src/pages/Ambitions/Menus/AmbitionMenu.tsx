import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import ArchiveIcon from '@mui/icons-material/Archive';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import type { AmbitionWithLinks } from '../../../types/ambition';
import useAmbitionContext from '../../../hooks/useAmbitionContext';
import AmbitionDialog from '../Dialogs/AmbitionDialog';
import ObjectiveDialog from '../Dialogs/ObjectiveDialog';
import LinkObjectivesDialog from '../Dialogs/LinkObjectivesDialog';

interface AmbitionMenuProps {
    ambition: AmbitionWithLinks;
}
type DialogType = 'Edit' | 'Archive' | 'AddObjective' | 'LinkObjectives';

const AmbitionMenu = ({ ambition }: AmbitionMenuProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const open = Boolean(anchorEl);

    const { archiveAmbition } = useAmbitionContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <AmbitionDialog onClose={() => setOpenedDialog(undefined)} ambition={ambition} />;
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            archiveAmbition(ambition.id);
                            setOpenedDialog(undefined);
                        }}
                        title='Archive Ambition'
                        message='This Ambition will be archived. (Linked Objectives/Actions will not be archived). Would you like to proceed?'
                        actionName='Archive'
                    />
                );
            case 'AddObjective':
                return <ObjectiveDialog onClose={() => setOpenedDialog(undefined)} ambition={ambition} />;
            case 'LinkObjectives':
                return <LinkObjectivesDialog onClose={() => setOpenedDialog(undefined)} ambition={ambition} />;
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
                    <ListItemText>Edit Ambition</ListItemText>
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
                    <ListItemText>Archive Ambition</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpenedDialog('AddObjective');
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
                        setOpenedDialog('LinkObjectives');
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <LinkIcon />
                    </ListItemIcon>
                    <ListItemText>Link/Unlink Objectives</ListItemText>
                </MenuItem>
            </Menu>
            {openedDialog && getDialog()}
        </>
    );
};

export default AmbitionMenu;
