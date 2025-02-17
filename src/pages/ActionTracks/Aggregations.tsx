import { Box, Button, Grid2 as Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import useUserAPI from '../../hooks/useUserAPI';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import ActionTrackButton from './ActionTrackButton';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const Aggregations = () => {
    const { isLoggedIn } = useUserAPI();
    const { isLoading, getActions, actions } = useActionContext();

    const getBeginning = (date: Date) => {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    };

    const getEnd = (date: Date) => {
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        date.setMilliseconds(999);
        return date;
    };

    const [startsAt, setStartsAt] = useState(getBeginning(new Date()));
    const [endsAt, setEndsAt] = useState(getEnd(new Date()));

    useEffect(() => {
        if (actions === undefined && !isLoading && isLoggedIn) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);
    return (
        <BasePage pageName='ActionTracks'>
            <Box sx={{ pb: 4, pt: 4 }}>
                <MobileDatePicker label='Start' value={startsAt} onChange={newValue => newValue !== null && setStartsAt(getBeginning(newValue))} />
                <MobileDatePicker label='End' value={endsAt} onChange={newValue => newValue !== null && setEndsAt(getEnd(newValue))} />
                <Button>Aggregate</Button>
                <Grid container spacing={1} sx={{ pb: 2 }}>
                    {actions?.map(action => (
                        <ActionTrackButton key={action.id} action={action} />
                    ))}
                </Grid>
            </Box>
        </BasePage>
    );
};

export default Aggregations;
