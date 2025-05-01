import { IconButton, Stack, Typography, Paper, CircularProgress, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import useDesiredStateContext from '../../hooks/useDesiredStateContext';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import SortIcon from '@mui/icons-material/Sort';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DesiredStateDialog from './dialogs/desired_states/DesiredStateDialog';
import type { DesiredState } from '../../types/my_way';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { DesiredStateIcon } from '../../components/CustomIcons';
import ArchivedDesiredStatesDialog from './dialogs/desired_states/ArchivedDesiredStatesDialog';
import SortDesiredStatesDialog from './dialogs/desired_states/SortDesiredStatesDialog';
import useMindsetContext from '../../hooks/useMindsetContext';
import useDiaryContext from '../../hooks/useDiaryContext';
import useReadingNoteContext from '../../hooks/useReadingNoteContext';
import useTagContext from '../../hooks/useTagContext';

type DialogType = 'CreateDesiredState' | 'SortDesiredStates' | 'ArchivedDesiredStates';

const DesiredStatesSection = () => {
    const { isLoading, getDesiredStates, desiredStates } = useDesiredStateContext();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'CreateDesiredState':
                return <DesiredStateDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'SortDesiredStates':
                return <SortDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchivedDesiredStates':
                return <ArchivedDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        if (desiredStates === undefined && !isLoading) getDesiredStates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStates, getDesiredStates]);
    return (
        <>
            <Stack direction='row' justifyContent='space-between'>
                <Stack direction='row' mt={0.5}>
                    <DesiredStateIcon />
                    <Typography variant='h6' textAlign='left'>
                        目指す姿 / 目標
                    </Typography>
                </Stack>
                <Stack direction='row'>
                    <IconButton onClick={() => setOpenedDialog('SortDesiredStates')} aria-label='add' color='primary'>
                        <SortIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpenedDialog('ArchivedDesiredStates')} aria-label='add' color='primary'>
                        <RestoreIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpenedDialog('CreateDesiredState')} aria-label='add' color='primary'>
                        <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack spacing={1} sx={{ textAlign: 'left' }}>
                {isLoading ? (
                    <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                ) : (
                    desiredStates?.map(desiredState => {
                        return <DesiredStateItem key={desiredState.id} desiredState={desiredState} />;
                    })
                )}
            </Stack>
            {openedDialog && getDialog()}
        </>
    );
};

const DesiredStateItem = ({ desiredState }: { desiredState: DesiredState }) => {
    const { archiveDesiredState, convertDesiredStateToMindset } = useDesiredStateContext();
    const { clearMindsetsCache } = useMindsetContext();
    const { clearDiariesCache } = useDiaryContext();
    const { clearReadingNotesCache } = useReadingNoteContext();
    const { clearTagsCache } = useTagContext();

    const [openedDialog, setOpenedDialog] = useState<'Edit' | 'Archive' | 'ConvertToMindset'>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return (
                    <DesiredStateDialog
                        desiredState={desiredState}
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                    />
                );
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            archiveDesiredState(desiredState.id);
                            setOpenedDialog(undefined);
                        }}
                        title='望む姿：一旦保留する'
                        message={`「${desiredState.name}」を一旦保留にします。保留にする他に、「心掛け」として残しておく手もありますよ。`}
                        actionName='一旦保留する'
                    />
                );
            case 'ConvertToMindset':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            convertDesiredStateToMindset(desiredState.id);
                            clearMindsetsCache();
                            clearDiariesCache();
                            clearReadingNotesCache();
                            clearTagsCache();
                            setOpenedDialog(undefined);
                        }}
                        title='望む姿 → 心掛け'
                        message={`「${desiredState.name}」を心掛けに変えます。「${desiredState.name}」のタグは引き続き使えますが、一度変換すると元に戻せません。`}
                        actionName='心掛けに変える'
                    />
                );
        }
    };
    return (
        <Paper key={desiredState.id} sx={{ py: 1, px: 2 }}>
            <Stack direction='row' justifyContent='space-between'>
                <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                    {desiredState.name}
                </Typography>
                <IconButton
                    size='small'
                    onClick={event => {
                        setMenuAnchor(event.currentTarget);
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                    <MenuItem
                        onClick={() => {
                            setMenuAnchor(null);
                            setOpenedDialog('Edit');
                        }}
                    >
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        <ListItemText>編集</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setMenuAnchor(null);
                            setOpenedDialog('Archive');
                        }}
                    >
                        <ListItemIcon>
                            <ArchiveIcon />
                        </ListItemIcon>
                        <ListItemText>一旦保留</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setMenuAnchor(null);
                            setOpenedDialog('ConvertToMindset');
                        }}
                    >
                        <ListItemIcon>
                            <SelfImprovementIcon />
                        </ListItemIcon>
                        <ListItemText>心掛けに変える</ListItemText>
                    </MenuItem>
                </Menu>
            </Stack>
            <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                {desiredState.description}
            </Typography>
            {openedDialog && getDialog()}
        </Paper>
    );
};

export default DesiredStatesSection;
