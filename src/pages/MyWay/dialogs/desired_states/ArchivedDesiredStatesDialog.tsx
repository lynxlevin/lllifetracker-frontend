import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import type { DesiredState } from '../../../../types/my_way';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import { DesiredStateAPI } from '../../../../apis/DesiredStateAPI';
import { format } from 'date-fns';
import useDesiredStateCategoryContext from '../../../../hooks/useDesiredStateCategoryContext';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

interface ArchivedDesiredStatesDialogProps {
    onClose: () => void;
}
type DialogType = 'Unarchive' | 'Delete';

const ArchivedDesiredStatesDialog = ({ onClose }: ArchivedDesiredStatesDialogProps) => {
    const [desiredStates, setDesiredStates] = useState<DesiredState[]>();
    const [selectedDesiredState, setSelectedDesiredState] = useState<DesiredState>();
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { unarchiveDesiredState, deleteDesiredState } = useDesiredStateContext();
    const { cmpDesiredStatesByCategory, categoryMap } = useDesiredStateCategoryContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Unarchive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedDesiredState(undefined);
                        }}
                        handleSubmit={() => {
                            unarchiveDesiredState(selectedDesiredState!.id);
                            setSelectedDesiredState(undefined);
                            setOpenedDialog(undefined);
                            const selectedDesiredStateIndex = desiredStates!.indexOf(selectedDesiredState!);
                            setDesiredStates(prev => [...prev!.slice(0, selectedDesiredStateIndex), ...prev!.slice(selectedDesiredStateIndex + 1)]);
                        }}
                        title="マイルストーン：アンアーカイブ"
                        message={`「${selectedDesiredState!.name}」をアンアーカイブします。`}
                        actionName="アンアーカイブする"
                    />
                );
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedDesiredState(undefined);
                        }}
                        handleSubmit={() => {
                            deleteDesiredState(selectedDesiredState!.id);
                            setSelectedDesiredState(undefined);
                            setOpenedDialog(undefined);
                            const selectedDesiredStateIndex = desiredStates!.indexOf(selectedDesiredState!);
                            setDesiredStates(prev => [...prev!.slice(0, selectedDesiredStateIndex), ...prev!.slice(selectedDesiredStateIndex + 1)]);
                        }}
                        title="マイルストーン：削除"
                        message={`「${selectedDesiredState!.name}」を完全に削除します。`}
                        actionName="削除する"
                    />
                );
        }
    };

    useEffect(() => {
        if (desiredStates === undefined) DesiredStateAPI.list(true).then(res => setDesiredStates(res.data));
    }, [desiredStates]);

    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterContent={<Typography>マイルストーン：アーカイブリスト</Typography>}
            content={
                <Stack spacing={1} sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
                    {desiredStates?.sort(cmpDesiredStatesByCategory).map((desiredState, idx) => {
                        const isFirstOfCategory = idx === 0 || desiredStates[idx - 1]!.category_id !== desiredState.category_id;
                        return (
                            <Box key={desiredState.id} width="100%">
                                {isFirstOfCategory && (
                                    <Typography>
                                        {desiredState.category_id === null ? 'カテゴリーなし' : categoryMap.get(desiredState.category_id)?.name}
                                    </Typography>
                                )}

                                <Paper sx={{ py: 1, px: 2 }}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                                            {desiredState.name}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSelectedDesiredState(desiredState);
                                                    setOpenedDialog('Unarchive');
                                                }}
                                            >
                                                <UnarchiveIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setSelectedDesiredState(desiredState);
                                                    setOpenedDialog('Delete');
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Stack>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                        {desiredState.description}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={100} pt={2} textAlign="right">
                                        アーカイブした日:{format(new Date(desiredState.updated_at), 'yyyy-MM-dd')}
                                    </Typography>
                                </Paper>
                            </Box>
                        );
                    })}
                    {openedDialog && getDialog()}
                </Stack>
            }
        />
    );
};

export default ArchivedDesiredStatesDialog;
