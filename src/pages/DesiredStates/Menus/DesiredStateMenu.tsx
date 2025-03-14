import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import type { DesiredStateWithLinks } from '../../../types/desired_state';
import DesiredStateDialog from '../Dialogs/DesiredStateDialog';
import useDesiredStateContext from '../../../hooks/useDesiredStateContext';

interface DesiredStateMenuProps {
    desiredState: DesiredStateWithLinks;
}

type DialogType = 'Edit' | 'Archive';

const DesiredStateMenu = ({ desiredState }: DesiredStateMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const open = Boolean(anchorEl);

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const { archiveDesiredState } = useDesiredStateContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <DesiredStateDialog onClose={() => setOpenedDialog(undefined)} desiredState={desiredState} />;
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            archiveDesiredState(desiredState.id);
                            setOpenedDialog(undefined);
                        }}
                        title='Archive DesiredState'
                        message='This DesiredState will be permanently archived. (Linked Ambitions/Actions will not be archived). Would you like to proceed?'
                        actionName='Archive'
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
                    <ListItemText>Edit DesiredState</ListItemText>
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
                    <ListItemText>Archive DesiredState</ListItemText>
                </MenuItem>
            </Menu>
            {openedDialog && getDialog()}
        </>
    );
};

export default DesiredStateMenu;
