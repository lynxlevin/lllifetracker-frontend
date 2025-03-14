import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import ArchiveIcon from '@mui/icons-material/Archive';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import type { AmbitionWithLinks } from '../../../../types/ambition';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import AmbitionDialog from '../Dialogs/AmbitionDialog';
import DesiredStateDialog from '../Dialogs/DesiredStateDialog';
import LinkDesiredStatesDialog from '../Dialogs/LinkDesiredStatesDialog';
import { AmbitionTypography, DesiredStateTypography } from '../../../../components/CustomTypography';

interface AmbitionMenuProps {
    ambition: AmbitionWithLinks;
}
type DialogType = 'Edit' | 'Archive' | 'AddDesiredState' | 'LinkDesiredStates';

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
                        title='大望：アーカイブ'
                        message={`「${ambition.name}」をアーカイブします。\n(Linked DesiredStates/Actions will not be archived).`}
                        actionName='アーカイブする'
                    />
                );
            case 'AddDesiredState':
                return <DesiredStateDialog onClose={() => setOpenedDialog(undefined)} ambition={ambition} />;
            case 'LinkDesiredStates':
                return <LinkDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} ambition={ambition} />;
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
                    <AmbitionTypography name='大望' />
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
                <ListSubheader>
                    <DesiredStateTypography name='目指す姿' />
                </ListSubheader>
                <MenuItem
                    onClick={() => {
                        setOpenedDialog('AddDesiredState');
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText>追加する</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpenedDialog('LinkDesiredStates');
                        handleClose();
                    }}
                >
                    <ListItemIcon>
                        <LinkIcon />
                    </ListItemIcon>
                    <ListItemText>Link/Unlink</ListItemText>
                </MenuItem>
            </Menu>
            {openedDialog && getDialog()}
        </>
    );
};

export default AmbitionMenu;
