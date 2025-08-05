import { Button, Card, Grid, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useActionContext from '../../../../hooks/useActionContext';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { moveItemDown, moveItemUp } from '../../../../hooks/useArraySort';
import type { Action } from '../../../../types/my_way';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

interface SortActionsDialogProps {
    onClose: () => void;
}

const SortActionsDialog = ({ onClose }: SortActionsDialogProps) => {
    const [actionIds, setActionIds] = useState<string[]>([]);
    const { actions: actionsMaster, bulkUpdateActionOrdering, getActions } = useActionContext();

    const save = async () => {
        if (actionIds === undefined) return;
        bulkUpdateActionOrdering(actionIds).then(_ => {
            getActions();
            onClose();
        });
    };

    useEffect(() => {
        if (actionIds.length === 0 && actionsMaster !== undefined && actionsMaster.length > 0) {
            setActionIds(actionsMaster.map(action => action.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionsMaster]);

    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterContent={<Typography variant="h6">活動：並び替え</Typography>}
            content={
                <Grid container spacing={1}>
                    {actionIds?.map((id, idx) => {
                        return (
                            <SortItem
                                key={id}
                                action={actionsMaster!.find(action => action.id === id)!}
                                idx={idx}
                                actionIdsLength={actionIds.length}
                                setActionIds={setActionIds}
                            />
                        );
                    })}
                </Grid>
            }
            bottomPart={
                <>
                    <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant="contained" onClick={save}>
                        保存する
                    </Button>
                </>
            }
        />
    );
};

const SortItem = ({
    action,
    idx,
    actionIdsLength,
    setActionIds,
}: {
    action: Action;
    idx: number;
    actionIdsLength: number;
    setActionIds: (value: React.SetStateAction<string[]>) => void;
}) => {
    const handleUp = (idx: number) => {
        if (idx === 0) return;
        setActionIds(prev => moveItemUp(prev, idx));
    };

    const handleDown = (idx: number) => {
        if (idx === actionIdsLength - 1) return;
        setActionIds(prev => moveItemDown(prev, idx));
    };
    return (
        <Grid size={12}>
            <Stack direction="row">
                <Card sx={{ py: 1, px: 1, bgcolor: action.trackable ? '#fff' : 'background.default', width: '100%' }}>
                    <Stack direction="row" alignItems="center" height="100%">
                        <span style={{ color: action?.color, paddingRight: '2px' }}>⚫︎</span>
                        <Typography
                            variant="body1"
                            sx={{
                                textShadow: 'lightgrey 0.4px 0.4px 0.5px',
                                ml: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {action.name}
                        </Typography>
                    </Stack>
                </Card>
                <IconButton
                    size="small"
                    onClick={() => {
                        handleUp(idx);
                    }}
                    disabled={idx === 0}
                >
                    <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => {
                        handleDown(idx);
                    }}
                    disabled={idx === actionIdsLength - 1}
                >
                    <ArrowDownwardIcon />
                </IconButton>
            </Stack>
        </Grid>
    );
};

export default SortActionsDialog;
