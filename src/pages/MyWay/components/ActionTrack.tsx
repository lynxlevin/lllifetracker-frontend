import styled from '@emotion/styled';
import { Card, Grid, Stack, Typography } from '@mui/material';
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
                    <Typography className='card-time'>
                        {getTime(actionTrack.started_at)}~{getTime(actionTrack.ended_at)}
                        {` (${getDurationString(actionTrack.duration, true)})`}
                    </Typography>
                );
            case 'Count':
                return <Typography className='card-time'>{getTime(actionTrack.started_at)}</Typography>;
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
            <StyledGrid size={12} onClick={() => setOpenedDialog('Edit')}>
                <Card className='card'>
                    <Stack className='card-content' direction='row' justifyContent='space-between' alignItems='end'>
                        <Typography className='card-name'>
                            <span style={{ color: action?.color, paddingRight: '2px' }}>⚫︎</span>
                            {action?.name}
                        </Typography>
                        {getTimeSection()}
                    </Stack>
                </Card>
            </StyledGrid>
            {openedDialog && getDialog()}
        </>
    );
};

const StyledGrid = styled(Grid)`
    .card {
        background-color: #fcfcfc;
    }
    .card-content {
        padding: 8px;
    }
    .card-name {
        padding-top: 0.35rem;
        padding-bottom: 0.35rem;
        font-size: 0.9rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .card-time {
        font-weight: 100;
        font-size: 0.8rem;
        white-space: nowrap;
        padding-left: 0.5em;
    }
`;

export default memo(ActionTrack);
