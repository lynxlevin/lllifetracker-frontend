import {
    Button,
    DialogActions,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography,
    FormControl,
    FormLabel,
    Collapse,
} from '@mui/material';
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
import { useState } from 'react';
import type { ActionTrackType, ActionWithGoal } from '../../../../types/my_way';
import useActionContext from '../../../../hooks/useActionContext';
import { ActionAPI } from '../../../../apis/ActionAPI';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

interface ActionCreateEditDialogProps {
    onClose: () => void;
    action?: ActionWithGoal;
}

const COLOR_LIST = [
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

const ActionCreateEditDialog = ({ onClose, action }: ActionCreateEditDialogProps) => {
    const [name, setName] = useState(action ? action.name : '');
    const [discipline, setDiscipline] = useState<string>(action?.discipline ?? '');
    const [memo, setMemo] = useState<string>(action?.memo ?? '');
    const [color, setColor] = useState(action ? action.color : '');
    const [trackType, setTrackType] = useState<ActionTrackType>(action ? action.track_type : 'TimeSpan');

    const [showColorSelect, setShowColorSelect] = useState(false);

    const { updateAction } = useActionContext();

    const getTrackTypeName = (trackType: ActionTrackType) => {
        switch (trackType) {
            case 'TimeSpan':
                return '時間';
            case 'Count':
                return '回数';
        }
    };

    const handleSubmit = () => {
        const disciplineNullable = discipline === '' ? null : discipline;
        const memoNullable = memo === '' ? null : memo;
        if (action === undefined) {
            // FIXME: Fix this double API calls.
            ActionAPI.create({ name, discipline: disciplineNullable, memo: memoNullable, track_type: trackType }).then(res => {
                const action_id = res.data.id;
                updateAction(action_id, name, disciplineNullable, memoNullable, color);
            });
        } else {
            updateAction(action.id, name, disciplineNullable, memoNullable, color);
        }
        onClose();
    };

    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterText={`活動：${action === undefined ? '追加' : '編集'}`}
            content={
                <FormControl>
                    {action === undefined && (
                        <Stack direction="row" alignItems="center">
                            <FormLabel sx={{ marginRight: '1rem' }}>計測方法</FormLabel>
                            <RadioGroup row value={trackType} onChange={event => setTrackType(event.target.value as ActionTrackType)}>
                                <FormControlLabel value="TimeSpan" control={<Radio />} label={getTrackTypeName('TimeSpan')} />
                                <FormControlLabel value="Count" control={<Radio />} label={getTrackTypeName('Count')} />
                            </RadioGroup>
                        </Stack>
                    )}
                    <TextField value={name} onChange={event => setName(event.target.value)} label="内容" fullWidth sx={{ marginTop: 1 }} />
                    <TextField
                        value={discipline}
                        onChange={event => setDiscipline(event.target.value)}
                        label="心構え"
                        multiline
                        fullWidth
                        minRows={5}
                        sx={{ marginTop: 1 }}
                    />
                    <TextField
                        value={memo}
                        onChange={event => setMemo(event.target.value)}
                        label="メモ"
                        multiline
                        fullWidth
                        minRows={5}
                        sx={{ marginTop: 1 }}
                    />
                    <Stack direction="row" alignItems="center" mt={1}>
                        <FormLabel sx={{ marginRight: '1rem' }}>色選択</FormLabel>
                        <Stack direction="row">
                            <span style={{ color, fontSize: '2em', lineHeight: '1.8em' }}>⚫︎</span>
                            <TextField value={color} onChange={event => setColor(event.target.value)} sx={{ width: '150px' }} />
                            <Button onClick={() => setShowColorSelect(prev => !prev)}>{showColorSelect ? '隠す' : 'パレット'}</Button>
                        </Stack>
                    </Stack>
                    <Collapse in={showColorSelect}>
                        <RadioGroup value={color} onChange={event => setColor(event.target.value)} sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                {COLOR_LIST.map(colorItem => (
                                    <Grid size={2} key={colorItem}>
                                        <Stack spacing={0}>
                                            <Typography variant="h5" align="center" color={colorItem}>
                                                ⚫︎
                                            </Typography>
                                            <Radio size="small" value={colorItem} sx={{ py: 0 }} />
                                        </Stack>
                                    </Grid>
                                ))}
                            </Grid>
                        </RadioGroup>
                    </Collapse>
                </FormControl>
            }
            bottomPart={
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <>
                        <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                            キャンセル
                        </Button>
                        <Button variant="contained" onClick={handleSubmit}>
                            {action === undefined ? '追加する' : '保存する'}
                        </Button>
                    </>
                </DialogActions>
            }
            bgColor="white"
        />
    );
};

export default ActionCreateEditDialog;
