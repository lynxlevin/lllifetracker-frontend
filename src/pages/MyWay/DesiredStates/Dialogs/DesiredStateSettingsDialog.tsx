import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
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
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';

interface DesiredStateSettingsDialogProps {
    onClose: () => void;
}

const DesiredStateSettingsDialog = ({ onClose }: DesiredStateSettingsDialogProps) => {
    const [desiredStates, setDesiredStates] = useState<{ id: string; name: string; description: string | null; sortNumber: number }[]>();
    const [hasError, setHasError] = useState(false);

    const { desiredStates: desiredStatesMaster, getDesiredStates, isLoading, bulkUpdateDesiredStateOrdering } = useDesiredStateContext();

    const setSortNumber = (id: string, sortNumber: number) => {
        setDesiredStates(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === id)!.sortNumber = sortNumber;
            return toBe;
        });
    };

    const save = async () => {
        if (desiredStates === undefined) return;
        setHasError(false);
        const duplicateSortNumber = desiredStates.length > new Set(desiredStates.map(desiredState => desiredState.sortNumber)).size;
        const invalidSortNumber = desiredStates.find(desiredState => desiredState.sortNumber > desiredStates.length);
        if (duplicateSortNumber || invalidSortNumber) {
            setHasError(true);
            return;
        }
        desiredStates.sort((a, b) => a.sortNumber - b.sortNumber);
        bulkUpdateDesiredStateOrdering(desiredStates.map(desiredState => desiredState.id)).then(_ => {
            getDesiredStates();
            onClose();
        });
    };

    useEffect(() => {
        if (desiredStatesMaster === undefined && !isLoading) getDesiredStates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStatesMaster, getDesiredStates]);

    useEffect(() => {
        if (desiredStates === undefined && desiredStatesMaster !== undefined) {
            const desiredStatesToSet = desiredStatesMaster.map((desiredState, index) => {
                return {
                    id: desiredState.id,
                    name: desiredState.name,
                    description: desiredState.description,
                    sortNumber: index + 1,
                };
            });
            setDesiredStates(desiredStatesToSet);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStatesMaster]);

    if (desiredStates === undefined || desiredStatesMaster === undefined) return <></>;

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Typography variant='h5'>目指す姿：設定</Typography>
                <TableContainer component={Box}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>目指す姿</TableCell>
                                <TableCell>表示順</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {desiredStates?.map(desiredState => (
                                <TableRow key={desiredState.id}>
                                    <TableCell component='th' scope='row'>
                                        {desiredState.name}
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={desiredState.sortNumber}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setSortNumber(desiredState.id, Number(event.target.value));
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
        </Dialog>
    );
};

export default DesiredStateSettingsDialog;
