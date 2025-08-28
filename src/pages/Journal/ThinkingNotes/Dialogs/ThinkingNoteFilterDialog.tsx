import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import type { Tag } from '../../../../types/tag';
import TagSelect from '../../../../components/TagSelect';
import { useMemo } from 'react';
import useTagContext from '../../../../hooks/useTagContext';
import { ThinkingNote } from '../../../../types/journal';

interface ThinkingNoteFilterDialogProps {
    onClose: () => void;
    thinkingNotes: ThinkingNote[];
    tagsFilter: Tag[];
    setTagsFilter: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const ThinkingNoteFilterDialog = ({ onClose, thinkingNotes, tagsFilter, setTagsFilter }: ThinkingNoteFilterDialogProps) => {
    const { tags } = useTagContext();
    const connectedTags = useMemo(() => {
        const tagIds: string[] = [];
        thinkingNotes?.forEach(thinkingNote => {
            tagIds.push(...thinkingNote.tags.filter(tag => !tagIds.includes(tag.id)).map(tag => tag.id));
        });
        return tags?.filter(tag => tagIds.includes(tag.id));
    }, [thinkingNotes, tags]);
    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent sx={{ pr: 0.5, pl: 0.5, pt: 2 }}>
                <TagSelect tags={tagsFilter} setTags={setTagsFilter} tagsMasterProp={connectedTags} />
                <Typography variant="body2">＊使用されているタグのみ選択肢に含めています。</Typography>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={() => setTagsFilter([])}>クリア</Button>
                    <Button variant="contained" onClick={onClose}>
                        検索
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default ThinkingNoteFilterDialog;
