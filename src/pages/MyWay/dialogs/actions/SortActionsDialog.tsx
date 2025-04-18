import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import useActionContext from '../../../../hooks/useActionContext';
import { ActionTypography } from '../../../../components/CustomTypography';

interface SortActionsDialogProps {
    onClose: () => void;
}

const SortActionsDialog = ({ onClose }: SortActionsDialogProps) => {
    const [actions, setActions] = useState<{ id: string; name: string; sortNumber: number }[]>();

    const { actions: actionsMaster, bulkUpdateActionOrdering, getActions } = useActionContext();

    const setSortNumber = (id: string, sortNumber: number) => {
        setActions(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === id)!.sortNumber = sortNumber;
            return toBe;
        });
    };

    const save = async () => {
        if (actions === undefined) return;
        actions.sort((a, b) => a.sortNumber - b.sortNumber);
        bulkUpdateActionOrdering(actions.map(action => action.id)).then(_ => {
            getActions();
            onClose();
        });
    };

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogTitle>
                <ActionTypography variant='h5' iconSize='medium' name={'活動：並び替え'} />
            </DialogTitle>
            <DialogContent>
                <div />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant='contained' onClick={save}>
                        '保存する'
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default SortActionsDialog;
