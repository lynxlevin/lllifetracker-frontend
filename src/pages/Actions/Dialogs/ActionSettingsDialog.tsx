import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { ActionWithLinks } from '../../../types/action';
import useActionContext from '../../../hooks/useActionContext';
import useLocalStorage from '../../../hooks/useLocalStorage';
import useUserAPI from '../../../hooks/useUserAPI';

interface ActionSettingsDialogProps {
    onClose: () => void;
    action?: ActionWithLinks;
}

const ActionSettingsDialog = ({ onClose, action }: ActionSettingsDialogProps) => {
    const [actions, setActions] = useState<{ id: string; name: string; sortNumber: number; disableTracking: boolean }[]>();
    const [hasError, setHasError] = useState(false);

    const { isLoggedIn } = useUserAPI();
    const { setActionSettings, getActionSettings } = useLocalStorage();
    const { actions: actionMaster, getActions, isLoading } = useActionContext();

    const setSortNumber = (actionId: string, sortNumber: number) => {
        setActions(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === actionId)!.sortNumber = sortNumber;
            return toBe;
        });
    };

    const setDisableTracking = (actionId: string, enabled: boolean) => {
        setActions(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === actionId)!.disableTracking = !enabled;
            return toBe;
        });
    };

    const save = () => {
        if (actions === undefined) return;
        setHasError(false);
        actions.sort((a, b) => a.sortNumber - b.sortNumber);
        const duplicateSortNumber = actions.length > new Set(actions.map(action => action.sortNumber)).size;
        const invalidSortNumber = actions.find(action => action.sortNumber > actions.length);
        if (duplicateSortNumber || invalidSortNumber) {
            setHasError(true);
            return;
        }
        setActionSettings({
            sort: actions.map(action => action.id),
            disableTracking: actions.filter(action => action.disableTracking).map(action => action.id),
        });
        onClose();
    };

    useEffect(() => {
        if (actionMaster === undefined && !isLoading && isLoggedIn) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionMaster, getActions]);

    useEffect(() => {
        if (actions === undefined && actionMaster !== undefined) {
            const actionSettings = getActionSettings();
            const actionsToSet = actionMaster.map((action, index) => {
                const sortIndex = actionSettings.sort.findIndex(setting => setting === action.id);
                const disableTracking = actionSettings.disableTracking.find(setting => setting === action.id);
                return {
                    id: action.id,
                    name: action.name,
                    sortNumber: sortIndex === -1 ? index + 1 : sortIndex + 1,
                    disableTracking: disableTracking !== undefined,
                };
            });
            actionsToSet.sort((a, b) => a.sortNumber - b.sortNumber);
            setActions(actionsToSet);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionMaster, actions, getActionSettings]);

    if (actions === undefined || actionMaster === undefined) return <></>;

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Typography variant='h5'>Action Settings</Typography>
                <TableContainer component={Box}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>行動</TableCell>
                                <TableCell>表示順</TableCell>
                                <TableCell>計測対象</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {actions?.map(action => (
                                <TableRow key={action.id}>
                                    <TableCell component='th' scope='row'>
                                        {action.name}
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={action.sortNumber}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setSortNumber(action.id, Number(event.target.value));
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={!action.disableTracking}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setDisableTracking(action.id, event.target.checked);
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        Cancel
                    </Button>
                    <Button variant='contained' onClick={save} sx={hasError ? { color: 'red' } : {}}>
                        Save locally
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default ActionSettingsDialog;
