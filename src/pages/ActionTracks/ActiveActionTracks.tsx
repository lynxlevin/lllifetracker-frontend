import { Stack } from '@mui/material';
import ActiveActionTrack from './ActiveActionTrack';
import type { ActionTrack } from '../../types/action_track';

interface ActiveActionTracksProps {
    activeActionTracks: ActionTrack[];
    bottom: number;
}

const ActiveActionTracks = ({ activeActionTracks, bottom }: ActiveActionTracksProps) => {
    return (
        <div style={{ paddingBottom: `${bottom - 60 + activeActionTracks.length * 58}px` }}>
            <Stack
                sx={{
                    position: 'fixed',
                    bottom: `${bottom}px`,
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
        </div>
    );
};

export default ActiveActionTracks;
