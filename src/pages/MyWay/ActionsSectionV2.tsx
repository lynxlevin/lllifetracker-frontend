import { Grid, Box, Button, IconButton, Stack, Typography, CircularProgress, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import useActionContext from '../../hooks/useActionContext';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import MenuIcon from '@mui/icons-material/Menu';
import SortIcon from '@mui/icons-material/Sort';
import RestoreIcon from '@mui/icons-material/Restore';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ActionTrack from './components/ActionTrack';
import { ActionIcon } from '../../components/CustomIcons';
import ActionTrackButtonV2 from './components/ActionTrackButtonV2';
import useLocalStorage from '../../hooks/useLocalStorage';
import { format } from 'date-fns';
import ActionTrackHistoryDialog from './dialogs/actions/ActionTrackHistoryDialog';
import ArchivedActionsDialog from './dialogs/actions/ArchivedActionsDialog';
import ActionDialogV2 from './dialogs/actions/ActionDialogV2';
import ActiveActionTrack from './components/ActiveActionTrack';
import SortActionsDialog from './dialogs/actions/SortActionsDialog';

type DialogType = 'CreateAction' | 'SortActions' | 'ArchivedActions' | 'ActionTrackHistory';

const ActionsSectionV2 = () => {
    const { isLoading: isLoadingActions, getActions, actions } = useActionContext();
    const { isLoading: isLoadingActionTrack, getActionTracks, actionTracksForTheDay, activeActionTracks, aggregationForTheDay } = useActionTrackContext();
    const { setActionTracksColumnsCount, getActionTracksColumnsCount } = useLocalStorage();
    const isLoading = isLoadingActions || isLoadingActionTrack;

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [actionTrackColumns, setActionTrackColumns] = useState<1 | 2 | 3>(getActionTracksColumnsCount());

    const getDialog = () => {
        switch (openedDialog) {
            case 'CreateAction':
                return <ActionDialogV2 onClose={() => setOpenedDialog(undefined)} />;
            case 'SortActions':
                return <SortActionsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchivedActions':
                return <ArchivedActionsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ActionTrackHistory':
                return <ActionTrackHistoryDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);

    useEffect(() => {
        if ([actionTracksForTheDay, activeActionTracks, aggregationForTheDay].some(x => x === undefined) && !isLoading) getActionTracks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksForTheDay, activeActionTracks, getActionTracks]);
    return (
        <>
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
                            setOpenedDialog('CreateAction');
                        }}
                    >
                        <AddCircleOutlineOutlinedIcon />
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
                                setOpenedDialog('SortActions');
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
                                setOpenedDialog('ArchivedActions');
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
                                setActionTrackColumns(1);
                                setMenuAnchor(null);
                            }}
                            disabled={actionTrackColumns === 1}
                        >
                            <ListItemIcon>
                                <TableRowsIcon />
                            </ListItemIcon>
                            <ListItemText>1列表示</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setActionTracksColumnsCount(2);
                                setActionTrackColumns(2);
                                setMenuAnchor(null);
                            }}
                            disabled={actionTrackColumns === 2}
                        >
                            <ListItemIcon>
                                <GridViewSharpIcon />
                            </ListItemIcon>
                            <ListItemText>2列表示</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setActionTracksColumnsCount(3);
                                setActionTrackColumns(3);
                                setMenuAnchor(null);
                            }}
                            disabled={actionTrackColumns === 3}
                        >
                            <ListItemIcon>
                                <ViewModuleIcon />
                            </ListItemIcon>
                            <ListItemText>3列表示</ListItemText>
                        </MenuItem>
                    </Menu>
                </Stack>
            </Stack>
            {isLoadingActions ? (
                <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
            ) : (
                actions && (
                    <Grid container spacing={1} sx={{ pb: 2 }}>
                        {actions.map(action => (
                            <ActionTrackButtonV2 key={action.id} action={action} columns={actionTrackColumns} disabled={!action.trackable} />
                        ))}
                    </Grid>
                )
            )}
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
        </>
    );
};

export default ActionsSectionV2;
