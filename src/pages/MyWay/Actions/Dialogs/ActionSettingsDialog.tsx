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
import type { ActionWithLinks } from '../../../../types/action';
import useActionContext from '../../../../hooks/useActionContext';
import { ActionAPI } from '../../../../apis/ActionAPI';

interface ActionSettingsDialogProps {
    onClose: () => void;
    action?: ActionWithLinks;
}

const ActionSettingsDialog = ({ onClose, action }: ActionSettingsDialogProps) => {
    const [actions, setActions] = useState<{ id: string; name: string; description: string | null; sortNumber: number; trackable: boolean }[]>();
    const [hasError, setHasError] = useState(false);

    const { actions: actionMaster, getActions, isLoading, bulkUpdateActionOrdering } = useActionContext();

    const setSortNumber = (actionId: string, sortNumber: number) => {
        setActions(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === actionId)!.sortNumber = sortNumber;
            return toBe;
        });
    };

    const setTrackable = (actionId: string, enabled: boolean) => {
        setActions(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === actionId)!.trackable = enabled;
            return toBe;
        });
    };

    const save = async () => {
        if (actions === undefined) return;
        setHasError(false);
        const duplicateSortNumber = actions.length > new Set(actions.map(action => action.sortNumber)).size;
        const invalidSortNumber = actions.find(action => action.sortNumber > actions.length);
        if (duplicateSortNumber || invalidSortNumber) {
            setHasError(true);
            return;
        }
        actions.sort((a, b) => a.sortNumber - b.sortNumber);
        await bulkUpdateActionOrdering(actions.map(action => action.id));

        const actionsToChangeTrackable = actions.filter(action => action.trackable !== actionMaster!.find(master => master.id === action.id)!.trackable!);
        const promises = actionsToChangeTrackable.map(action => {
            return ActionAPI.update(action.id, { name: action.name, description: action.description, trackable: action.trackable });
        });
        Promise.all(promises).then(values => {
            getActions();
            onClose();
        });
    };

    useEffect(() => {
        if (actionMaster === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionMaster, getActions]);

    useEffect(() => {
        if (actions === undefined && actionMaster !== undefined) {
            const actionsToSet = actionMaster.map((action, index) => {
                return {
                    id: action.id,
                    name: action.name,
                    description: action.description,
                    sortNumber: index + 1,
                    trackable: action.trackable!,
                };
            });
            setActions(actionsToSet);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionMaster]);

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
                                            checked={action.trackable}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setTrackable(action.id, event.target.checked);
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
