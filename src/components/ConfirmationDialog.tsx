import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface ConfirmationDialogProps {
    onClose: () => void;
    handleSubmit: () => void;
    title: string;
    message: string;
    actionName: string;
}

const ConfirmationDialog = ({ onClose, handleSubmit, title, message, actionName }: ConfirmationDialogProps) => {
    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>キャンセル</Button>
                <Button onClick={handleSubmit} sx={actionName === 'Delete' ? { color: 'red' } : {}}>
                    {actionName}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
