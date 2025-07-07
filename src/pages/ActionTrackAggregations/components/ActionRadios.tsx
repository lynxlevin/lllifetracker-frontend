import { RadioGroup, FormControlLabel, Radio, Grid } from '@mui/material';
import type { Action } from '../../../types/my_way';

const ActionRadios = ({
    selectedAction,
    actions,
    selectAction,
}: { selectedAction: Action; actions?: Action[]; selectAction: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <RadioGroup value={selectedAction.id} onChange={selectAction}>
            <Grid container spacing={1} sx={{ textAlign: 'left', pl: 1, whiteSpace: 'nowrap' }}>
                {actions?.map(action => (
                    <Grid size={4} key={action.id}>
                        <FormControlLabel
                            value={action.id}
                            control={<Radio size='small' sx={{ padding: 0.5, '& .MuiSvgIcon-root': { fontSize: '14px' } }} />}
                            label={action.name}
                            sx={{
                                '& .MuiTypography-root': { fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' },
                                width: '100%',
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </RadioGroup>
    );
};

export default ActionRadios;
