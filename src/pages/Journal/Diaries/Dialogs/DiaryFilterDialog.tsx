import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import type { Tag } from '../../../../types/tag';
import TagSelect from '../../../../components/TagSelect';
import { useMemo } from 'react';
import useDiaryContext from '../../../../hooks/useDiaryContext';
import useTagContext from '../../../../hooks/useTagContext';

interface DiaryFilterDialogProps {
    onClose: () => void;
    tagsFilter: Tag[];
    setTagsFilter: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const DiaryFilterDialog = ({ onClose, tagsFilter, setTagsFilter }: DiaryFilterDialogProps) => {
    const { diaries } = useDiaryContext();
    const { tags } = useTagContext();
    const connectedTags = useMemo(() => {
        const tagIds: string[] = [];
        diaries?.forEach(diary => {
            tagIds.push(...diary.tags.filter(tag => !tagIds.includes(tag.id)).map(tag => tag.id));
        });
        return tags?.filter(tag => tagIds.includes(tag.id));
    }, [diaries, tags]);
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

export default DiaryFilterDialog;
