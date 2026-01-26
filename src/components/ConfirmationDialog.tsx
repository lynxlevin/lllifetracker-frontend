import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface ConfirmationDialogProps {
    onClose: () => void;
    handleSubmit: () => void;
    title: string;
    message: string;
    actionName: string;
    actionColor?: 'error';
}

const ConfirmationDialog = ({ onClose, handleSubmit, title, message, actionName, actionColor }: ConfirmationDialogProps) => {
    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>キャンセル</Button>
                <Button onClick={handleSubmit} color={actionColor ? actionColor : 'error'}>
                    {actionName}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
