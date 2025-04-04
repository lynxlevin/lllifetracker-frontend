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
import useActionContext from '../../../../hooks/useActionContext';
import { ActionAPI } from '../../../../apis/ActionAPI';
import ActionColorSelectDialog from './ActionColorSelectDialog';

interface ActionSettingsDialogProps {
    onClose: () => void;
}

export interface ActionSettingsInner {
    id: string;
    name: string;
    description: string | null;
    sortNumber: number;
    trackable: boolean;
    color: string;
}

const ActionSettingsDialog = ({ onClose }: ActionSettingsDialogProps) => {
    const [actions, setActions] = useState<ActionSettingsInner[]>();
    const [hasError, setHasError] = useState(false);
    const [selectedAction, setSelectedAction] = useState<ActionSettingsInner>();

    const { actions: actionMaster, getActions, isLoading, bulkUpdateActionOrdering } = useActionContext();

    const setSortNumber = (id: string, sortNumber: number) => {
        setActions(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === id)!.sortNumber = sortNumber;
            return toBe;
        });
    };

    const setTrackable = (id: string, enabled: boolean) => {
        setActions(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === id)!.trackable = enabled;
            return toBe;
        });
    };

    const setColor = (id: string, color: string) => {
        setActions(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === id)!.color = color;
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

        const actionsToUpdate = actions.filter(
            action =>
                action.trackable !== actionMaster!.find(master => master.id === action.id)!.trackable! ||
                action.color !== actionMaster!.find(master => master.id === action.id)!.color!,
        );
        const promises = actionsToUpdate.map(action => {
            return ActionAPI.update(action.id, { name: action.name, description: action.description, trackable: action.trackable, color: action.color });
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
                    color: action.color!,
                };
            });
            setActions(actionsToSet);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionMaster]);

    if (actions === undefined || actionMaster === undefined) return <></>;

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent>
                <Typography variant='h5'>活動：設定</Typography>
                <TableContainer component={Box}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>活動</TableCell>
                                <TableCell>表示順</TableCell>
                                <TableCell>計測対象</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {actions?.map(action => (
                                <TableRow key={action.id}>
                                    <TableCell component='th' scope='row' onClick={() => setSelectedAction(action)}>
                                        <span style={{ color: action.color }}>⚫︎</span>
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
                        キャンセル
                    </Button>
                    <Button variant='contained' onClick={save} sx={hasError ? { color: 'red' } : {}}>
                        保存する
                    </Button>
                </>
            </DialogActions>
            {selectedAction && <ActionColorSelectDialog action={selectedAction} onSelect={setColor} onClose={() => setSelectedAction(undefined)} />}
        </Dialog>
    );
};

export default ActionSettingsDialog;
