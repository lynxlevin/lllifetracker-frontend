import { Box, Button, CircularProgress, Divider, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import ActionTrackButton from './components/ActionTrackButton';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import SortIcon from '@mui/icons-material/Sort';
import InventoryIcon from '@mui/icons-material/Inventory';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SortActionsDialog from './dialogs/actions/SortActionsDialog';
import ArchivedActionsDialog from './dialogs/actions/ArchivedActionsDialog';
import ActionTrackHistoryDialog from './dialogs/actions/ActionTrackHistoryDialog';
import { ActionIcon } from '../../components/CustomIcons';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import ActionTrack from './components/ActionTrack';
import { format } from 'date-fns';
import ActiveActionTrack from './components/ActiveActionTrack';
import type { ActionFull } from '../../types/my_way';
import ActionCreateEditDialog from './dialogs/actions/ActionCreateEditDialog';
import { MilesForTheDay } from '../../types/action_track';

type DialogType = 'Create' | 'Sort' | 'ArchivedItems' | 'ActionTrackHistory';

const Actions = () => {
    const { isLoading: isLoadingActions, getActions, activeActions } = useActionContext();
    const { isLoading: isLoadingActionTrack, getActionTracks, actionTracksForTheDay, activeActionTracks, clearActionTracksCache } = useActionTrackContext();
    const { setActionTracksColumnsCount, actionTracksColumnsCount } = useLocalStorage();
    const isLoading = isLoadingActions || isLoadingActionTrack;

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [openedChildDialogs, setOpenedChildDialogs] = useState<string[]>([]);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [actionTracksCacheIsStale, setActionTracksCacheIsStale] = useState(false);

    const addOrRemoveOpenedChildDialogs = (dialog: string, action: 'Open' | 'Close') => {
        switch (action) {
            case 'Open':
                setOpenedChildDialogs(prev => [...prev, dialog]);
                break;
            case 'Close':
                setOpenedChildDialogs(prev => {
                    const toBe = [...prev];
                    const index = toBe.indexOf(dialog);
                    if (index > -1) toBe.splice(index, 1);
                    return toBe;
                });
        }
    };

    const milesForTheDay = useMemo(() => {
        if (actionTracksForTheDay === undefined) return undefined;
        const res: MilesForTheDay = {};
        actionTracksForTheDay.forEach(track => {
            // FIXME: duration should be undefined for count type.
            const mile = track.duration === null || track.duration === 0 ? 1 : track.duration;
            if (track.action_id in res) {
                res[track.action_id] = res[track.action_id] + mile;
            } else {
                res[track.action_id] = mile;
            }
        });
        return res;
    }, [actionTracksForTheDay]);

    const actionFulls = useMemo((): ActionFull[] => {
        if (activeActions === undefined) return [];
        return activeActions.map(action => {
            const isLoadingMiles = milesForTheDay === undefined;
            const mile = !isLoadingMiles && action.id in milesForTheDay ? milesForTheDay[action.id] : 0;
            const remainingMiles =
                action.goal === null
                    ? null
                    : action.track_type === 'TimeSpan'
                      ? Math.ceil((action.goal.duration_seconds - mile) / 60)
                      : action.goal.count - mile;

            return {
                mile,
                remainingMiles,
                isLoadingMiles,
                ...action,
            };
        });
    }, [activeActions, milesForTheDay]);

    const mapActions = () => {
        if (isLoadingActions) return <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />;

        if (actionFulls.length > 0) {
            return (
                <Grid container spacing={1} sx={{ pb: 2 }}>
                    {actionFulls.map(action => (
                        <ActionTrackButton
                            key={action.id}
                            action={action}
                            columns={actionTracksColumnsCount}
                            signalOpenedDialog={addOrRemoveOpenedChildDialogs}
                        />
                    ))}
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
                return <ActionCreateEditDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Sort':
                return <SortActionsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchivedItems':
                return <ArchivedActionsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ActionTrackHistory':
                return <ActionTrackHistoryDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        function markAsShouldClearCache() {
            if (!document.hidden) {
                setActionTracksCacheIsStale(true);
            }
        }
        document.removeEventListener('visibilitychange', markAsShouldClearCache);
        document.addEventListener('visibilitychange', markAsShouldClearCache);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!actionTracksCacheIsStale) return;
        if (openedDialog !== undefined || openedChildDialogs.length > 0) return;
        clearActionTracksCache();
        setActionTracksCacheIsStale(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openedDialog, actionTracksCacheIsStale, openedChildDialogs.length]);

    useEffect(() => {
        if (activeActions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeActions, getActions]);

    useEffect(() => {
        if (isLoading) return;
        if ([actionTracksForTheDay, activeActionTracks].some(x => x === undefined)) {
            getActionTracks();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksForTheDay, activeActionTracks, getActionTracks]);
    return (
        <BasePage pageName="Actions">
            <Box sx={{ pt: 4 }}>
                <Stack direction="row" justifyContent="space-between" pb={1}>
                    <Stack direction="row" mt={0.5} alignItems="center">
                        <ActionIcon size="small" />
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
                                    <InventoryIcon />
                                </ListItemIcon>
                                <ListItemText>保管庫</ListItemText>
                            </MenuItem>
                            <Divider />
                            <Typography variant="body2" textAlign="center" color="grey">
                                表示オプション
                            </Typography>
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
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography>{format(new Date(), 'yyyy-MM-dd E')}</Typography>
                        <Button variant="text" onClick={() => setOpenedDialog('ActionTrackHistory')}>
                            全履歴表示
                        </Button>
                    </Stack>
                    {isLoadingActionTrack ? (
                        <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                    ) : (
                        actionTracksForTheDay !== undefined &&
                        actionTracksForTheDay.length > 0 &&
                        actionTracksForTheDay
                            .filter(actionTrack => actionTrack.ended_at !== null)
                            .map(actionTrack => {
                                return <ActionTrack key={actionTrack.id} actionTrack={actionTrack} signalOpenedDialog={addOrRemoveOpenedChildDialogs} />;
                            })
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
                            {activeActionTracks?.map(actionTrack => (
                                <ActiveActionTrack
                                    key={`active-${actionTrack.id}`}
                                    actionTrack={actionTrack}
                                    signalOpenedDialog={addOrRemoveOpenedChildDialogs}
                                />
                            ))}
                        </Stack>
                    </div>
                )}
                {openedDialog && getDialog()}
            </Box>
        </BasePage>
    );
};

export default Actions;
