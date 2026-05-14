import styled from '@emotion/styled';
import { memo } from 'react';
import type { ActionTrack as IActionTrack } from '../../../../types/action_track';
import { Checkbox, Divider, FormControlLabel, Stack, Typography } from '@mui/material';
import useActionContext from '../../../../hooks/useActionContext';
import { ActionTrackType } from '../../../../types/my_way';
import { getDurationString } from '../../../../hooks/useValueDisplay';

const ActionTrackCalculationItem = ({
    actionTrack,
    addDuration,
    subDuration,
}: {
    actionTrack: IActionTrack;
    addDuration: (duration: number) => void;
    subDuration: (duration: number) => void;
}) => {
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
    return (
        <>
            <StyledDiv>
                <FormControlLabel
                    className="action-track-form-control"
                    control={
                        <Checkbox
                            onChange={event => (event.target.checked ? addDuration(actionTrack.duration ?? 0) : subDuration(actionTrack.duration ?? 0))}
                        />
                    }
                    label={
                        <Typography className="action-track-name">
                            <StyledSpan dotColor={action?.color}>⚫︎</StyledSpan>
                            {action?.name}
                        </Typography>
                    }
                />
                <Stack direction="row" alignItems="center">
                    {getTimeSection()}
                </Stack>
            </StyledDiv>
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

    .action-track-form-control {
        flex-grow: 1;
        overflow: hidden;
    }
    .action-track-name {
        padding-top: 0.35rem;
        padding-bottom: 0.35rem;
        font-size: 0.9rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
    }
    .action-track-time {
        font-weight: 100;
        font-size: 0.8rem;
        white-space: nowrap;
        padding-left: 0.5em;
    }
`;

export default memo(ActionTrackCalculationItem);
