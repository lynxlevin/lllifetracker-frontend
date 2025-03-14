import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import type { DesiredStateWithLinks } from '../../../../types/desired_state';
import DesiredStateDialog from '../Dialogs/DesiredStateDialog';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import { DesiredStateTypography } from '../../../../components/CustomTypography';

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
                        title='目指す姿：アーカイブ'
                        message={`「${desiredState.name}」をアーカイブします。\n(Linked Ambitions/Actions will not be archived).`}
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
                    <DesiredStateTypography name='目指す姿' />
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

export default DesiredStateMenu;
