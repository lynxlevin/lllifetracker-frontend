import { Box, Button, CircularProgress, Divider, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import ActionTrackButtonV2 from './components/ActionTrackButtonV2';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import SortIcon from '@mui/icons-material/Sort';
import RestoreIcon from '@mui/icons-material/Restore';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ActionDialogV2 from './dialogs/actions/ActionDialogV2';
import SortActionsDialog from './dialogs/actions/SortActionsDialog';
import ArchivedActionsDialog from './dialogs/actions/ArchivedActionsDialog';
import ActionTrackHistoryDialog from './dialogs/actions/ActionTrackHistoryDialog';
import { ActionIcon } from '../../components/CustomIcons';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import ActionTrack from './components/ActionTrack';
import { format } from 'date-fns';
import ActiveActionTrack from './components/ActiveActionTrack';

type DialogType = 'Create' | 'Sort' | 'ArchivedItems' | 'ActionTrackHistory';

const Actions = () => {
    const { isLoading: isLoadingActions, getActions, actions } = useActionContext();
    const {
        isLoading: isLoadingActionTrack,
        getActionTracks,
        actionTracksForTheDay,
        activeActionTracks,
        aggregationForTheDay,
        getActiveActionTracks,
        clearActiveActionTracksCache,
    } = useActionTrackContext();
    const { setActionTracksColumnsCount, actionTracksColumnsCount } = useLocalStorage();
    const isLoading = isLoadingActions || isLoadingActionTrack;

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const mapActions = () => {
        if (isLoadingActions) return;
        <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />;
        const items = actions?.map(action => (
            <ActionTrackButtonV2 key={action.id} action={action} columns={actionTracksColumnsCount} disabled={!action.trackable} />
        ));

        if (actions !== undefined && actions.length > 0) {
            return (
                <Grid container spacing={1} sx={{ pb: 2 }}>
                    {items}
                </Grid>
            );
        }

        return (
            <Button variant="outlined" fullWidth onClick={() => setOpenedDialog('Create')}>
                <AddIcon /> 新規作成
            </Button>
        );
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <ActionDialogV2 onClose={() => setOpenedDialog(undefined)} />;
            case 'Sort':
                return <SortActionsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchivedItems':
                return <ArchivedActionsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ActionTrackHistory':
                return <ActionTrackHistoryDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        document.removeEventListener('visibilitychange', clearActiveActionTracksCache);
        document.addEventListener('visibilitychange', clearActiveActionTracksCache);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);

    useEffect(() => {
        if (isLoading) return;
        if (activeActionTracks === undefined && [actionTracksForTheDay, aggregationForTheDay].every(x => x !== undefined)) {
            getActiveActionTracks();
        } else if ([actionTracksForTheDay, activeActionTracks, aggregationForTheDay].some(x => x === undefined)) {
            getActionTracks();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksForTheDay, activeActionTracks, getActionTracks]);
    return (
        <BasePage pageName="Actions">
            <Box sx={{ pt: 4 }}>
                <Stack direction="row" justifyContent="space-between" pb={1}>
                    <Stack direction="row" mt={0.5}>
                        <ActionIcon />
                        <Typography variant="h6" textAlign="left">
                            活動
                        </Typography>
                    </Stack>
                    <Stack direction="row">
                        <IconButton
                            size="small"
                            onClick={() => {
                                setOpenedDialog('Create');
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                        <IconButton
                            size="small"
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
                                    setOpenedDialog('Sort');
                                }}
                            >
                                <ListItemIcon>
                                    <SortIcon />
                                </ListItemIcon>
                                <ListItemText>並び替え</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setMenuAnchor(null);
                                    setOpenedDialog('ArchivedItems');
                                }}
                            >
                                <ListItemIcon>
                                    <RestoreIcon />
                                </ListItemIcon>
                                <ListItemText>アーカイブ</ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={() => {
                                    setActionTracksColumnsCount(1);
                                    setMenuAnchor(null);
                                }}
                                disabled={actionTracksColumnsCount === 1}
                            >
                                <ListItemIcon>
                                    <TableRowsIcon />
                                </ListItemIcon>
                                <ListItemText>1列表示</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setActionTracksColumnsCount(2);
                                    setMenuAnchor(null);
                                }}
                                disabled={actionTracksColumnsCount === 2}
                            >
                                <ListItemIcon>
                                    <GridViewSharpIcon />
                                </ListItemIcon>
                                <ListItemText>2列表示</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setActionTracksColumnsCount(3);
                                    setMenuAnchor(null);
                                }}
                                disabled={actionTracksColumnsCount === 3}
                            >
                                <ListItemIcon>
                                    <ViewModuleIcon />
                                </ListItemIcon>
                                <ListItemText>3列表示</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Stack>
                {mapActions()}
                <Box>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography>{format(new Date(), 'yyyy-MM-dd E')}</Typography>
                        <Button variant="text" onClick={() => setOpenedDialog('ActionTrackHistory')}>
                            全履歴表示
                        </Button>
                    </Stack>
                    {isLoadingActionTrack ? (
                        <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                    ) : (
                        actionTracksForTheDay !== undefined &&
                        actionTracksForTheDay.length > 0 && (
                            <Grid container spacing={1}>
                                {actionTracksForTheDay.map(actionTrack => {
                                    if (actionTrack.ended_at !== null) {
                                        return <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />;
                                    }
                                    return <div key={actionTrack.id} />;
                                })}
                            </Grid>
                        )
                    )}
                </Box>
                {activeActionTracks && (
                    <div style={{ paddingBottom: `${100 - 60 + activeActionTracks.length * 58}px` }}>
                        <Stack
                            sx={{
                                position: 'fixed',
                                bottom: '100px',
                                left: 0,
                                right: 0,
                                padding: 0.5,
                            }}
                            spacing={0.5}
                        >
                            {activeActionTracks?.map(actionTrack => <ActiveActionTrack key={`active-${actionTrack.id}`} actionTrack={actionTrack} />)}
                        </Stack>
                    </div>
                )}
                {openedDialog && getDialog()}
            </Box>
        </BasePage>
    );
};

export default Actions;
