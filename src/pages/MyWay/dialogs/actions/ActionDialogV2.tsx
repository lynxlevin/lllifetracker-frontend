import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    IconButton,
    Grid,
    Radio,
    RadioGroup,
    Stack,
    Switch,
    TextField,
    Typography,
    FormControl,
    FormLabel,
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
import type { Action, ActionTrackType } from '../../../../types/my_way';
import useActionContext from '../../../../hooks/useActionContext';
import { ActionTypography } from '../../../../components/CustomTypography';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import { ActionAPI } from '../../../../apis/ActionAPI';

interface ActionDialogV2Props {
    onClose: () => void;
    action?: Action;
}

type DialogType = 'ConvertTrackType' | 'Archive';

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

const ActionDialogV2 = ({ onClose, action }: ActionDialogV2Props) => {
    const [name, setName] = useState(action ? action.name : '');
    const [description, setDescription] = useState<string>(action?.description ?? '');
    const [trackable, setTrackable] = useState(action ? action.trackable : true);
    const [color, setColor] = useState(action ? action.color : '');
    const [trackType, setTrackType] = useState<ActionTrackType>(action ? action.track_type : 'TimeSpan');

    const [isEditMode, setIsEditMode] = useState(action === undefined);
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { updateAction, archiveAction, convertActionTrackType } = useActionContext();

    const getTrackTypeName = (trackType: ActionTrackType) => {
        switch (trackType) {
            case 'TimeSpan':
                return '時間';
            case 'Count':
                return '回数';
        }
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'ConvertTrackType':
                if (action === undefined) return <></>;
                {
                    const trackType = action.track_type === 'Count' ? 'TimeSpan' : 'Count';
                    return (
                        <ConfirmationDialog
                            onClose={() => setOpenedDialog(undefined)}
                            handleSubmit={() => {
                                convertActionTrackType(action.id, trackType);
                                setOpenedDialog(undefined);
                                onClose();
                            }}
                            title='活動：計測方法変換'
                            message={`「${action.name}」の計測方法を「${getTrackTypeName(trackType)}」へ変換します。計測済みの履歴は変換されません。`}
                            actionName='変換する'
                        />
                    );
                }
            case 'Archive':
                if (action === undefined) return <></>;
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            archiveAction(action.id);
                            setOpenedDialog(undefined);
                        }}
                        title='活動：アーカイブ'
                        message={`「${action.name}」をアーカイブします。`}
                        actionName='アーカイブする'
                    />
                );
        }
    };

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (action === undefined) {
            // FIXME: Fix this double API calls.
            ActionAPI.create({ name, description: descriptionNullable, track_type: trackType }).then(res => {
                const action_id = res.data.id;
                updateAction(action_id, name, descriptionNullable, trackable, color);
            });
        } else {
            updateAction(action.id, name, descriptionNullable, trackable, color);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogTitle>
                <Stack direction='row' justifyContent='space-between'>
                    <ActionTypography variant='h5' name={`活動：${action === undefined ? '追加' : '編集'}`} />
                    {action !== undefined && (
                        <Box>
                            {isEditMode ? (
                                <IconButton size='small' onClick={() => setIsEditMode(false)}>
                                    <EditOffIcon />
                                </IconButton>
                            ) : (
                                <IconButton
                                    size='small'
                                    onClick={() => {
                                        setName(action.name);
                                        setDescription(action.description ?? '');
                                        setTrackable(action.trackable);
                                        setIsEditMode(true);
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            )}
                            <IconButton
                                size='small'
                                onClick={() => {
                                    setOpenedDialog('Archive');
                                }}
                            >
                                <ArchiveIcon />
                            </IconButton>
                        </Box>
                    )}
                </Stack>
            </DialogTitle>
            <DialogContent>
                {isEditMode ? (
                    <FormControl>
                        <TextField value={name} onChange={event => setName(event.target.value)} label='内容' fullWidth sx={{ marginTop: 1 }} />
                        <TextField
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                            label='詳細'
                            multiline
                            fullWidth
                            minRows={5}
                            sx={{ marginTop: 1 }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={trackable}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setTrackable(event.target.checked);
                                    }}
                                />
                            }
                            label='計測対象'
                        />
                        {action === undefined ? (
                            <>
                                <FormLabel>計測方法</FormLabel>
                                <RadioGroup row value={trackType} onChange={event => setTrackType(event.target.value as ActionTrackType)}>
                                    <FormControlLabel value='TimeSpan' control={<Radio />} label={getTrackTypeName('TimeSpan')} />
                                    <FormControlLabel value='Count' control={<Radio />} label={getTrackTypeName('Count')} />
                                </RadioGroup>
                            </>
                        ) : (
                            <Typography>計測方法：{getTrackTypeName(action!.track_type)}</Typography>
                        )}
                        <>
                            <FormLabel>色選択</FormLabel>
                            <Stack direction='row'>
                                <span style={{ color, fontSize: '2em', lineHeight: '1.8em' }}>⚫︎</span>
                                <TextField label='色' value={color} onChange={event => setColor(event.target.value)} />
                            </Stack>
                            <RadioGroup value={color} onChange={event => setColor(event.target.value)} sx={{ mt: 1 }}>
                                <Grid container spacing={2}>
                                    {COLOR_LIST.map(colorItem => (
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
                        </>
                    </FormControl>
                ) : (
                    <>
                        <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mb: 1, lineHeight: '1em' }}>
                            {action!.name}
                        </Typography>
                        <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                            {action!.description}
                        </Typography>
                        <Divider sx={{ mt: 1 }} />
                        <Typography>計測対象{action!.trackable ? '' : '外'}</Typography>
                        <Stack direction='row' alignItems='center'>
                            <Typography>計測方法：{getTrackTypeName(action!.track_type)}</Typography>
                            <IconButton size='small' onClick={() => setOpenedDialog('ConvertTrackType')}>
                                <ChangeCircleIcon />
                                変更
                            </IconButton>
                        </Stack>
                        <Stack direction='row'>
                            <Typography style={{ color, fontSize: '1.1em' }}>⚫︎</Typography>
                            <Typography>: {action!.color}</Typography>
                        </Stack>
                    </>
                )}
            </DialogContent>
            {isEditMode && (
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <>
                        <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }} disabled={!isEditMode}>
                            キャンセル
                        </Button>
                        <Button variant='contained' onClick={handleSubmit} disabled={!isEditMode}>
                            {action === undefined ? '追加する' : '保存する'}
                        </Button>
                    </>
                </DialogActions>
            )}
            {openedDialog && getDialog()}
        </Dialog>
    );
};

export default ActionDialogV2;
