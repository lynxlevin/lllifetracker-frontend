import {
    Button,
    DialogActions,
    FormControlLabel,
    IconButton,
    Grid,
    Radio,
    RadioGroup,
    Stack,
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
import { useEffect, useState } from 'react';
import type { ActionTrackType, ActionWithGoal } from '../../../../types/my_way';
import useActionContext from '../../../../hooks/useActionContext';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import { ActionAPI } from '../../../../apis/ActionAPI';
import AbsoluteButton from '../../../../components/AbsoluteButton';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import ActionGoalDialog from './ActionGoalDialog';
import useTagContext from '../../../../hooks/useTagContext';
import type { Journal as JournalType } from '../../../../types/journal';
import { JournalAPI } from '../../../../apis/JournalAPI';
import Journal from '../../../Journal/Journal';

interface ActionDialogProps {
    onClose: () => void;
    action?: ActionWithGoal;
}

type DialogType = 'ConvertTrackType' | 'Archive' | 'Goal' | 'Journals';

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

const ActionDialog = ({ onClose, action }: ActionDialogProps) => {
    const [name, setName] = useState(action ? action.name : '');
    const [description, setDescription] = useState<string>(action?.description ?? '');
    const [color, setColor] = useState(action ? action.color : '');
    const [trackType, setTrackType] = useState<ActionTrackType>(action ? action.track_type : 'TimeSpan');

    const [isEditMode, setIsEditMode] = useState(action === undefined);
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [showColorSelect, setShowColorSelect] = useState(false);
    const [journals, setJournals] = useState<JournalType[]>();

    const { updateAction, archiveAction, convertActionTrackType, removeActionGoal } = useActionContext();
    const { tags, getTags, isLoading: isLoadingTags } = useTagContext();

    const getTrackTypeName = (trackType: ActionTrackType) => {
        switch (trackType) {
            case 'TimeSpan':
                return '時間';
            case 'Count':
                return '回数';
        }
    };

    const getGoalDisplay = () => {
        if (!action?.goal) return 'なし';
        return action.track_type === 'TimeSpan' ? `${action.goal.duration_seconds / 60} 分` : `${action.goal.count} 回`;
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
                updateAction(action_id, name, descriptionNullable, color);
            });
        } else {
            updateAction(action.id, name, descriptionNullable, color);
        }
        onClose();
    };

    useEffect(() => {
        if (action === undefined) return;
        if (tags !== undefined || isLoadingTags) return;
        getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getTags, tags]);
    useEffect(() => {
        if (action === undefined) return;
        if (journals !== undefined) return;
        const actionTagIds = tags?.filter(tag => tag.type === 'Action' && tag.name === action.name).map(tag => tag.id) ?? [];
        if (actionTagIds.length === 0) return;
        JournalAPI.list({ tag_id_or: actionTagIds }).then(res => {
            setJournals(res.data);
        });
    }, [action, journals, tags]);

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
                        <Box mt={1}>
                            <FormLabel>色選択</FormLabel>
                            <Stack direction="row">
                                <span style={{ color, fontSize: '2em', lineHeight: '1.8em' }}>⚫︎</span>
                                <TextField label="色" value={color} onChange={event => setColor(event.target.value)} />
                                <Button onClick={() => setShowColorSelect(prev => !prev)}>{showColorSelect ? '色選択を隠す' : '色を選択する'}</Button>
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
                        </Box>
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
                        {action !== undefined && <Typography color="rgba(0, 0, 0, 0.38)">1日の目標：{getGoalDisplay()}</Typography>}
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
                    <Paper sx={{ padding: 2 }}>
                        <Stack direction="row" alignItems="center" mb={1}>
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
                        <Typography>1日の目標：{getGoalDisplay()}</Typography>
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
                    {journals !== undefined && (
                        <Grid container spacing={1}>
                            {journals.map(journal => {
                                const journalId = journal.diary?.id ?? journal.reading_note?.id ?? journal.thinking_note?.id;
                                return <Journal key={journalId} journal={journal} />;
                            })}
                        </Grid>
                    )}
                    <AbsoluteButton
                        onClick={() => {
                            setIsEditMode(true);
                        }}
                        bottom={10}
                        right={20}
                        icon={<EditIcon fontSize="large" />}
                    />
                    {openedDialog && getDialog()}
                </>
            }
            bgColor="grey"
        />
    );
};

export default ActionDialog;
