import styled from '@emotion/styled';
import { Divider, Typography } from '@mui/material';
import { memo, useState } from 'react';
import type { ActionTrack as IActionTrack } from '../../../types/action_track';
import ActionTrackDialog from '../dialogs/actions/ActionTrackDialog';
import useActionContext from '../../../hooks/useActionContext';
import type { ActionTrackType } from '../../../types/my_way';
import { getDurationString } from '../../../hooks/useValueDisplay';

interface ActionTrackProps {
    actionTrack: IActionTrack;
}
type DialogType = 'Edit' | 'Delete';

const ActionTrack = ({ actionTrack }: ActionTrackProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

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
        }
    };

    return (
        <>
            <StyledDiv onClick={() => setOpenedDialog('Edit')}>
                <Typography className="action-track-name">
                    <StyledSpan dotColor={action?.color}>⚫︎</StyledSpan>
                    {action?.name}
                </Typography>
                {getTimeSection()}
            </StyledDiv>
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
    }
    .action-track-time {
        font-weight: 100;
        font-size: 0.8rem;
        white-space: nowrap;
        padding-left: 0.5em;
    }
`;

export default memo(ActionTrack);
