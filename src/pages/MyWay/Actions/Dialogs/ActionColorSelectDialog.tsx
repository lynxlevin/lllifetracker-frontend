import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Grid2 as Grid,
    Grid2,
    Input,
    Radio,
    RadioGroup,
    Stack,
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
import { amber, red, deepPurple, lightBlue, lightGreen, brown } from '@mui/material/colors';

interface ActionColorSelectDialogProps {
    action: ActionSettingsInner;
    onSelect: (id: string, color: string) => void;
    onClose: () => void;
}

const ActionColorSelectDialog = ({ action, onSelect, onClose }: ActionColorSelectDialogProps) => {
    const [color, setColor] = useState(action.color);

    const colorList = [
        red[100],
        amber[100],
        lightGreen[100],
        lightBlue[100],
        deepPurple[100],
        brown[100],
        red[300],
        amber[300],
        lightGreen[300],
        lightBlue[300],
        deepPurple[300],
        brown[300],
        red[900],
        amber[900],
        lightGreen[900],
        lightBlue[900],
        deepPurple[900],
        brown[900],
    ];

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Typography variant='h5'>{action.name}：色選択</Typography>
                <span style={{ color }}>⚫︎</span>
                <TextField value={color} onChange={event => setColor(event.target.value)} />
                <RadioGroup value={color} onChange={event => setColor(event.target.value)}>
                    <Grid container spacing={2}>
                        {colorList.map(colorItem => (
                            <Grid size={2} key={colorItem}>
                                <Stack spacing={0}>
                                    <Typography variant='h5' align='center' color={colorItem}>
                                        ⚫︎
                                    </Typography>
                                    <Radio size='small' value={colorItem} sx={{ py: 0 }} />
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>
                </RadioGroup>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button
                        variant='contained'
                        onClick={() => {
                            onSelect(action.id, color);
                            onClose();
                        }}
                    >
                        選択する
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default ActionColorSelectDialog;
