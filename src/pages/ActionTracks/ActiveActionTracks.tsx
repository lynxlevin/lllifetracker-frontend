import { Stack } from '@mui/material';
import ActiveActionTrack from './ActiveActionTrack';
import type { ActionTrack } from '../../types/action_track';

interface ActiveActionTracksProps {
    activeActionTracks: ActionTrack[];
    bottom: string;
}

const ActiveActionTracks = ({ activeActionTracks, bottom }: ActiveActionTracksProps) => {
    return (
        <Stack
            sx={{
                position: 'fixed',
                bottom,
                left: 0,
                right: 0,
                padding: 0.5,
            }}
            spacing={0.5}
        >
            {activeActionTracks?.map(actionTrack => (
                <ActiveActionTrack key={`active-${actionTrack.id}`} actionTrack={actionTrack} />
            ))}
        </Stack>
    );
};

export default ActiveActionTracks;
