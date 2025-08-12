import {
    Button,
    DialogActions,
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
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Box,
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
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import { ActionAPI } from '../../../../apis/ActionAPI';
import AbsoluteEditButton from '../../../../components/AbsoluteEditButton';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import ActionGoalDialog from './ActionGoalDialog';

interface ActionDialogV2Props {
    onClose: () => void;
    action?: ActionWithGoal;
}

type DialogType = 'ConvertTrackType' | 'Archive' | 'Goal';

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
    const [color, setColor] = useState(action ? action.color : '');
    const [trackType, setTrackType] = useState<ActionTrackType>(action ? action.track_type : 'TimeSpan');

    const [isEditMode, setIsEditMode] = useState(action === undefined);
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [showEditButton, setShowEditButton] = useState(false);

    const { updateAction, archiveAction, convertActionTrackType, toggleTrackable, removeActionGoal } = useActionContext();

    const getTrackTypeName = (trackType: ActionTrackType) => {
        switch (trackType) {
            case 'TimeSpan':
                return '時間';
            case 'Count':
                return '回数';
        }
    };

    const getDialog = () => {
        if (action === undefined) return <></>;
        switch (openedDialog) {
            case 'ConvertTrackType': {
                const trackType = action.track_type === 'Count' ? 'TimeSpan' : 'Count';
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            convertActionTrackType(action.id, trackType);
                            setOpenedDialog(undefined);
                            onClose();
                        }}
                        title="活動：計測方法変換"
                        message={`「${action.name}」の計測方法を「${getTrackTypeName(trackType)}」へ変換します。計測済みの履歴には影響はありません。`}
                        actionName="変換する"
                    />
                );
            }
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            archiveAction(action.id);
                            setOpenedDialog(undefined);
                        }}
                        title="活動：アーカイブ"
                        message={`「${action.name}」をアーカイブします。`}
                        actionName="アーカイブする"
                    />
                );
            case 'Goal':
                return <ActionGoalDialog action={action} onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (action === undefined) {
            // FIXME: Fix this double API calls.
            ActionAPI.create({ name, description: descriptionNullable, track_type: trackType }).then(res => {
                const action_id = res.data.id;
                updateAction(action_id, name, descriptionNullable, true, color);
            });
        } else {
            updateAction(action.id, name, descriptionNullable, action.trackable, color);
        }
        onClose();
    };

    if (isEditMode)
        return (
            <DialogWithAppBar
                onClose={onClose}
                appBarCenterContent={<Typography variant="h5">活動：{action === undefined ? '追加' : '編集'}</Typography>}
                content={
                    <FormControl>
                        <TextField value={name} onChange={event => setName(event.target.value)} label="内容" fullWidth sx={{ marginTop: 1 }} />
                        <TextField
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                            label="詳細"
                            multiline
                            fullWidth
                            minRows={5}
                            sx={{ marginTop: 1 }}
                        />
                        <FormControlLabel
                            control={<Switch checked={action === undefined ? true : action.trackable} disabled />}
                            label={action === undefined ? undefined : action.trackable ? '取り組み中' : 'ちょっと休憩中'}
                        />
                        {action === undefined ? (
                            <>
                                <FormLabel>計測方法</FormLabel>
                                <RadioGroup row value={trackType} onChange={event => setTrackType(event.target.value as ActionTrackType)}>
                                    <FormControlLabel value="TimeSpan" control={<Radio />} label={getTrackTypeName('TimeSpan')} />
                                    <FormControlLabel value="Count" control={<Radio />} label={getTrackTypeName('Count')} />
                                </RadioGroup>
                            </>
                        ) : (
                            <Typography color="rgba(0, 0, 0, 0.38)">計測方法：{getTrackTypeName(action!.track_type)}</Typography>
                        )}
                        <Box mt={1}>
                            <FormLabel>色選択</FormLabel>
                            <Stack direction="row">
                                <span style={{ color, fontSize: '2em', lineHeight: '1.8em' }}>⚫︎</span>
                                <TextField label="色" value={color} onChange={event => setColor(event.target.value)} />
                            </Stack>
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
                        </Box>
                    </FormControl>
                }
                bottomPart={
                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <>
                            <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }} disabled={!isEditMode}>
                                キャンセル
                            </Button>
                            <Button variant="contained" onClick={handleSubmit} disabled={!isEditMode}>
                                {action === undefined ? '追加する' : '保存する'}
                            </Button>
                        </>
                    </DialogActions>
                }
                bgColor="white"
            />
        );
    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterContent={<Typography variant="h5">活動</Typography>}
            appBarMenu={
                <>
                    <IconButton
                        size="small"
                        onClick={event => {
                            setMenuAnchor(event.currentTarget);
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                        <>
                            <MenuItem
                                onClick={() => {
                                    setMenuAnchor(null);
                                    setIsEditMode(true);
                                }}
                            >
                                <ListItemIcon>
                                    <EditIcon />
                                </ListItemIcon>
                                <ListItemText>編集</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setMenuAnchor(null);
                                    setOpenedDialog('Archive');
                                }}
                            >
                                <ListItemIcon>
                                    <ArchiveIcon />
                                </ListItemIcon>
                                <ListItemText>アーカイブする</ListItemText>
                            </MenuItem>
                        </>
                    </Menu>
                </>
            }
            content={
                <>
                    <Paper sx={{ padding: 2 }} onClick={() => setShowEditButton(prev => !prev)}>
                        <Stack direction="row" alignItems="center" mb={1}>
                            {!action!.trackable && '💤'}
                            <Typography variant="body1" style={{ color }}>
                                ⚫︎
                            </Typography>
                            <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                                {action!.name}
                            </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                            {action!.description}
                        </Typography>
                    </Paper>
                    <Stack direction="row" alignItems="center" mt={1.5}>
                        <Typography>状態：{action!.trackable ? '取り組み中' : 'おやすみ中'}</Typography>
                        <Button size="small" sx={{ marginLeft: 1 }} onClick={() => toggleTrackable(action!, !action!.trackable)}>
                            {action!.trackable ? (
                                <>
                                    <BakeryDiningIcon />
                                    おやすみする
                                </>
                            ) : (
                                <>
                                    <MilitaryTechIcon />
                                    取り組み再開する
                                </>
                            )}
                        </Button>
                    </Stack>
                    <Stack direction="row" alignItems="center" mt={1.5}>
                        <Typography>計測方法：{getTrackTypeName(action!.track_type)}</Typography>
                        <Button size="small" sx={{ marginLeft: 1 }} onClick={() => setOpenedDialog('ConvertTrackType')}>
                            {action!.track_type === 'TimeSpan' ? (
                                <>
                                    <ChangeCircleIcon />
                                    回数での計測に変更
                                </>
                            ) : (
                                <>
                                    <ChangeCircleIcon />
                                    時間での計測に変更
                                </>
                            )}
                        </Button>
                    </Stack>
                    <Stack direction="row" alignItems="center" mt={1.5}>
                        {action!.track_type === 'TimeSpan' ? (
                            <Typography>1日の目標：{action!.goal?.duration_seconds ? `${action!.goal.duration_seconds / 60} 分` : 'なし'}</Typography>
                        ) : (
                            <Typography>1日の目標：{action!.goal?.count ? `${action!.goal.count} 回` : 'なし'}</Typography>
                        )}
                        <Button size="small" sx={{ marginLeft: 1 }} onClick={() => setOpenedDialog('Goal')}>
                            <>
                                <EditIcon />
                                設定
                            </>
                        </Button>
                        <Button
                            size="small"
                            sx={{ marginLeft: 1 }}
                            onClick={() => {
                                removeActionGoal(action!.id);
                            }}
                        >
                            <>
                                <RamenDiningIcon />
                                おやすみする
                            </>
                        </Button>
                    </Stack>
                    <AbsoluteEditButton
                        onClick={() => {
                            setIsEditMode(true);
                            setShowEditButton(false);
                        }}
                        size="large"
                        bottom={10}
                        right={20}
                        visible={showEditButton}
                    />
                    {openedDialog && getDialog()}
                </>
            }
            bgColor="grey"
        />
    );
};

export default ActionDialogV2;
