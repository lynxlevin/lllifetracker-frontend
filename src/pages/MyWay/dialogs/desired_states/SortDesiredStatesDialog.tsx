import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { DesiredStateTypography } from '../../../../components/CustomTypography';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';

interface SortDesiredStatesDialogProps {
    onClose: () => void;
}

const SortDesiredStatesDialog = ({ onClose }: SortDesiredStatesDialogProps) => {
    const [desiredStates, setDesiredStates] = useState<{ id: string; name: string; sortNumber: number }[]>();

    const { desiredStates: desiredStatesMaster, bulkUpdateDesiredStateOrdering, getDesiredStates } = useDesiredStateContext();

    const setSortNumber = (id: string, sortNumber: number) => {
        setDesiredStates(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === id)!.sortNumber = sortNumber;
            return toBe;
        });
    };

    const save = async () => {
        if (desiredStates === undefined) return;
        desiredStates.sort((a, b) => a.sortNumber - b.sortNumber);
        bulkUpdateDesiredStateOrdering(desiredStates.map(desiredState => desiredState.id)).then(_ => {
            getDesiredStates();
            onClose();
        });
    };

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogTitle>
                <DesiredStateTypography variant='h5' iconSize='medium' name={'目指す姿：並び替え'} />
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

export default SortDesiredStatesDialog;
