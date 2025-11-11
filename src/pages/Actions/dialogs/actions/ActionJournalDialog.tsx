import { Grid, Typography } from '@mui/material';
import type { Action } from '../../../../types/my_way';
import { useEffect, useState } from 'react';
import type { Journal as JournalType } from '../../../../types/journal';
import { JournalAPI } from '../../../../apis/JournalAPI';
import useTagContext from '../../../../hooks/useTagContext';
import Journal from '../../../Journal/Journal';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

interface ActionJournalDialogProps {
    onClose: () => void;
    action: Action;
}

const ActionJournalDialog = ({ onClose, action }: ActionJournalDialogProps) => {
    const { tags, getTags, isLoading: isLoadingTags } = useTagContext();
    const [journals, setJournals] = useState<JournalType[]>();

    useEffect(() => {
        if (tags !== undefined || isLoadingTags) return;
        getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getTags, tags]);
    useEffect(() => {
        if (journals !== undefined) return;
        const actionTagIds = tags?.filter(tag => tag.type === 'Action' && tag.name === action.name).map(tag => tag.id) ?? [];
        if (actionTagIds.length === 0) return;
        JournalAPI.list({ tag_id_or: actionTagIds }).then(res => {
            setJournals(res.data);
        });
    }, [action.name, journals, tags]);
    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterContent={<Typography>「{action.name}」タグの日誌</Typography>}
            content={
                journals === undefined ? (
                    <Typography>日誌の取得中か、または取得失敗しています。</Typography>
                ) : (
                    <Grid container spacing={1}>
                        {journals.map(journal => {
                            const journalId = journal.diary?.id ?? journal.reading_note?.id ?? journal.thinking_note?.id;
                            return <Journal key={journalId} journal={journal} />;
                        })}
                    </Grid>
                )
            }
            bgColor="grey"
        />
    );
};

export default ActionJournalDialog;
