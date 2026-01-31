import { Dialog, DialogContent, Typography } from '@mui/material';
import type { Action } from '../../../../types/my_way';

interface ActionFocusDialogProps {
    onClose: () => void;
    action: Action;
}

const ActionFocusDialog = ({ onClose, action }: ActionFocusDialogProps) => {
    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mb: 1, lineHeight: '1em' }}>
                    {action.name}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                    {action.discipline}
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default ActionFocusDialog;
