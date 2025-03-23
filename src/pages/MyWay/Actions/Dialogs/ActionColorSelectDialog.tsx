import { Button, Dialog, DialogActions, DialogContent, Grid2 as Grid, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import type { ActionSettingsInner } from './ActionSettingsDialog';
import { useState } from 'react';
import {
    amber,
    red,
    deepPurple,
    lightBlue,
    lightGreen,
    brown,
    pink,
    purple,
    indigo,
    blue,
    cyan,
    teal,
    green,
    lime,
    yellow,
    orange,
    deepOrange,
    blueGrey,
} from '@mui/material/colors';

interface ActionColorSelectDialogProps {
    action: ActionSettingsInner;
    onSelect: (id: string, color: string) => void;
    onClose: () => void;
}

const ActionColorSelectDialog = ({ action, onSelect, onClose }: ActionColorSelectDialogProps) => {
    const [color, setColor] = useState(action.color);

    const colorList = [
        red[300],
        pink[300],
        purple[300],
        deepPurple[300],
        indigo[300],
        blue[300],
        lightBlue[300],
        cyan[300],
        teal[300],
        green[300],
        lightGreen[300],
        lime[300],
        yellow[300],
        amber[300],
        orange[300],
        deepOrange[300],
        brown[300],
        blueGrey[300],
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
