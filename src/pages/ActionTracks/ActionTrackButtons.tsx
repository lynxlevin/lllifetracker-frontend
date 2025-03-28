import { Grid2 as Grid, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import ActionTrackButton from './ActionTrackButton';
import type { Action } from '../../types/action';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';

interface ActionTrackButtonsProps {
    actions: Action[];
}

const ActionTrackButtons = ({ actions }: ActionTrackButtonsProps) => {
    const { setActionTracksColumnsCount, getActionTracksColumnsCount } = useLocalStorage();

    const [columns, setColumns] = useState<1 | 2>(getActionTracksColumnsCount());

    return (
        <>
            <Stack direction='row' pb={1}>
                <div style={{ flexGrow: 1 }} />
                <ToggleButtonGroup
                    value={columns}
                    size='small'
                    exclusive
                    onChange={(_, newValue) => {
                        setActionTracksColumnsCount(newValue);
                        setColumns(newValue);
                    }}
                >
                    <ToggleButton value={1}>
                        <TableRowsIcon />
                    </ToggleButton>
                    <ToggleButton value={2}>
                        <GridViewSharpIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>
            <Grid container spacing={1} sx={{ pb: 2 }}>
                {actions
                    ?.filter(action => action.trackable)
                    .map(action => (
                        <ActionTrackButton key={action.id} action={action} columns={columns} />
                    ))}
            </Grid>
        </>
    );
};

export default ActionTrackButtons;
