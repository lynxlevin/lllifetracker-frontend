import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import type { Action } from '../../../../types/action';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import ActionDialog from '../Dialogs/ActionDialog';
import { ActionTypography } from '../../../../components/CustomTypography';

interface ActionMenuProps {
    action: Action;
}

type DialogType = 'Edit' | 'Archive';

const ActionMenu = ({ action }: ActionMenuProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const [anchorEl, setAnchorEl] = useState<HTMLElement>();
    const open = Boolean(anchorEl);

    const { archiveAction } = useAmbitionContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <ActionDialog onClose={() => setOpenedDialog(undefined)} action={action} />;
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            archiveAction(action.id);
                            setOpenedDialog(undefined);
                        }}
                        title='行動：アーカイブ'
                        message={`「${action.name}」をアーカイブします。\n(Linked Ambitions/DesiredStates will not be archived).`}
                        actionName='アーカイブする'
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
                <ListSubheader>
                    <ActionTypography name='行動' />
                </ListSubheader>
                <MenuItem
                    onClick={() => {
                        setOpenedDialog('Edit');
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText>編集する</ListItemText>
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
                    <ListItemText>アーカイブする</ListItemText>
                </MenuItem>
            </Menu>
            {openedDialog && getDialog()}
        </>
    );
};

export default ActionMenu;
