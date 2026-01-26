import styled from '@emotion/styled';
import { Collapse, Divider, IconButton, Stack, Typography } from '@mui/material';
import { memo, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ActionTrack as IActionTrack } from '../../../types/action_track';
import ActionTrackDialog from '../dialogs/actions/ActionTrackDialog';
import useActionContext from '../../../hooks/useActionContext';
import type { ActionTrackType } from '../../../types/my_way';
import { getDurationString } from '../../../hooks/useValueDisplay';
import { TransitionGroup } from 'react-transition-group';
import HorizontalSwipeBox from '../../../components/HorizontalSwipeBox';
import useActionTrackContext from '../../../hooks/useActionTrackContext';
import ConfirmationDialog from '../../../components/ConfirmationDialog';

interface ActionTrackProps {
    actionTrack: IActionTrack;
    signalOpenedDialog?: (dialog: string, action: 'Open' | 'Close') => void;
}
type DialogType = 'Edit' | 'Delete';

const ActionTrack = ({ actionTrack, signalOpenedDialog }: ActionTrackProps) => {
    const { deleteActionTrack } = useActionTrackContext();
    const [swipedLeft, setSwipedLeft] = useState(false);
    const [openedDialog, _setOpenedDialog] = useState<DialogType>();
    const setOpenedDialog = (dialog?: DialogType) => {
        if (signalOpenedDialog !== undefined)
            signalOpenedDialog(`ActionTrack:${actionTrack.action_id}:${dialog ?? openedDialog}`, dialog === undefined ? 'Close' : 'Open');
        _setOpenedDialog(dialog);
    };

    const { actions } = useActionContext();
    const action = actions?.find(act => act.id === actionTrack.action_id);

    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };
    const getTime = (dateString: string | null) => {
        if (dateString === null) return '';
        const date = new Date(dateString);
        return `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}`;
    };

    const getTimeSection = () => {
        const trackType: ActionTrackType = action === undefined ? 'TimeSpan' : action.track_type;
        switch (trackType) {
            case 'TimeSpan':
                return (
                    <Typography className="action-track-time">
                        {getTime(actionTrack.started_at)}~{getTime(actionTrack.ended_at)}
                        {` (${getDurationString(actionTrack.duration, true) ?? ''})`}
                    </Typography>
                );
            case 'Count':
                return <Typography className="action-track-time">{getTime(actionTrack.started_at)}</Typography>;
        }
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <ActionTrackDialog onClose={() => setOpenedDialog(undefined)} actionTrack={actionTrack} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            deleteActionTrack(actionTrack.id);
                            setOpenedDialog(undefined);
                        }}
                        title="計測履歴の削除"
                        message={`${action?.name}の計測履歴を削除します。一度削除すると元に戻せません。`}
                        actionName="削除"
                        actionColor="error"
                    />
                );
        }
    };

    return (
        <>
            <HorizontalSwipeBox distance={75} onSwipeLeft={swiped => setSwipedLeft(swiped)} keepSwipeState>
                <StyledDiv>
                    <Typography className="action-track-name" onClick={() => setOpenedDialog('Edit')}>
                        <StyledSpan dotColor={action?.color}>⚫︎</StyledSpan>
                        {action?.name}
                    </Typography>
                    <Stack direction="row" alignItems="center">
                        {getTimeSection()}
                        <TransitionGroup>
                            {swipedLeft && (
                                <Collapse in={swipedLeft} orientation="horizontal">
                                    <IconButton color="error" onClick={() => setOpenedDialog('Delete')}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Collapse>
                            )}
                        </TransitionGroup>
                    </Stack>
                </StyledDiv>
            </HorizontalSwipeBox>
            {openedDialog && getDialog()}
            <Divider />
        </>
    );
};

const StyledSpan = styled('span')((props: { dotColor?: string }) => ({
    paddingRight: '2px',
    color: props.dotColor,
}));

const StyledDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    margin-left: 8px;
    margin-right: 8px;
    height: 3rem;

    .action-track-name {
        padding-top: 0.35rem;
        padding-bottom: 0.35rem;
        font-size: 0.9rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        flex-grow: 1;
        text-align: left;
    }
    .action-track-time {
        font-weight: 100;
        font-size: 0.8rem;
        white-space: nowrap;
        padding-left: 0.5em;
    }
`;

export default memo(ActionTrack);
