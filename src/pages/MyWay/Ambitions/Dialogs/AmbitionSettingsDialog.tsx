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
import useAmbitionContext from '../../../../hooks/useAmbitionContext';

interface AmbitionSettingsDialogProps {
    onClose: () => void;
}

const AmbitionSettingsDialog = ({ onClose }: AmbitionSettingsDialogProps) => {
    const [ambitions, setAmbitions] = useState<{ id: string; name: string; description: string | null; sortNumber: number }[]>();
    const [hasError, setHasError] = useState(false);

    const { ambitionsWithLinks, getAmbitionsWithLinks, isLoading, bulkUpdateAmbitionOrdering } = useAmbitionContext();

    const setSortNumber = (id: string, sortNumber: number) => {
        setAmbitions(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === id)!.sortNumber = sortNumber;
            return toBe;
        });
    };

    const save = async () => {
        if (ambitions === undefined) return;
        setHasError(false);
        const duplicateSortNumber = ambitions.length > new Set(ambitions.map(ambition => ambition.sortNumber)).size;
        const invalidSortNumber = ambitions.find(ambition => ambition.sortNumber > ambitions.length);
        if (duplicateSortNumber || invalidSortNumber) {
            setHasError(true);
            return;
        }
        ambitions.sort((a, b) => a.sortNumber - b.sortNumber);
        bulkUpdateAmbitionOrdering(ambitions.map(ambition => ambition.id)).then(_ => {
            getAmbitionsWithLinks();
            onClose();
        });
    };

    useEffect(() => {
        if (ambitionsWithLinks === undefined && !isLoading) getAmbitionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitionsWithLinks, getAmbitionsWithLinks]);

    useEffect(() => {
        if (ambitions === undefined && ambitionsWithLinks !== undefined) {
            const ambitionsToSet = ambitionsWithLinks.map((ambition, index) => {
                return {
                    id: ambition.id,
                    name: ambition.name,
                    description: ambition.description,
                    sortNumber: index + 1,
                };
            });
            setAmbitions(ambitionsToSet);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitionsWithLinks]);

    if (ambitions === undefined || ambitionsWithLinks === undefined) return <></>;

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Typography variant='h5'>大望：設定</Typography>
                <TableContainer component={Box}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>大望</TableCell>
                                <TableCell>表示順</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ambitions?.map(amition => (
                                <TableRow key={amition.id}>
                                    <TableCell component='th' scope='row'>
                                        {amition.name}
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={amition.sortNumber}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                setSortNumber(amition.id, Number(event.target.value));
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

export default AmbitionSettingsDialog;
