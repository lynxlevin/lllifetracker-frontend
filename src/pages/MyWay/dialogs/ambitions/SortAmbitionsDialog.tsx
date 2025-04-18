import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import { AmbitionTypography } from '../../../../components/CustomTypography';

interface SortAmbitionsDialogProps {
    onClose: () => void;
}

const SortAmbitionsDialog = ({ onClose }: SortAmbitionsDialogProps) => {
    const [ambitions, setAmbitions] = useState<{ id: string; name: string; sortNumber: number }[]>();

    const { ambitions: ambitionsMaster, bulkUpdateAmbitionOrdering, getAmbitions } = useAmbitionContext();

    const setSortNumber = (id: string, sortNumber: number) => {
        setAmbitions(prev => {
            const toBe = [...prev!];
            toBe.find(pre => pre.id === id)!.sortNumber = sortNumber;
            return toBe;
        });
    };

    const save = async () => {
        if (ambitions === undefined) return;
        ambitions.sort((a, b) => a.sortNumber - b.sortNumber);
        bulkUpdateAmbitionOrdering(ambitions.map(ambition => ambition.id)).then(_ => {
            getAmbitions();
            onClose();
        });
    };

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogTitle>
                <AmbitionTypography variant='h5' iconSize='medium' name={'大望：並び替え'} />
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

export default SortAmbitionsDialog;
