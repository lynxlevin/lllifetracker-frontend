import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Input,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import type { ActionSettingsInner } from './ActionSettingsDialog';
import { useState } from 'react';

interface ActionColorSelectDialogProps {
    action: ActionSettingsInner;
    onClose: () => void;
}

const ActionColorSelectDialog = ({ action, onClose }: ActionColorSelectDialogProps) => {
    const [color, setColor] = useState(action.color);
    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Typography variant='h5'>{action.name}：色選択</Typography>
                <TableContainer component={Box}>
                    <Table>
                        <TableBody>
                            <TextField value={color} onChange={event => setColor(event.target.value)} />
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    {/* <Button variant='contained' onClick={save} sx={hasError ? { color: 'red' } : {}}>
                        保存する
                    </Button> */}
                </>
            </DialogActions>
        </Dialog>
    );
};

export default ActionColorSelectDialog;
