import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface DeleteConfirmationDialogProps {
    onClose: () => void;
    handleSubmit: () => void;
    title: string;
    message: string;
}

const DeleteConfirmationDialog = ({ onClose, handleSubmit, title, message }: DeleteConfirmationDialogProps) => {
    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: 'primary.dark' }}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} sx={{ color: 'red' }}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
