import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import type { Tag } from '../../../../types/tag';
import TagSelect from '../../../../components/TagSelect';

interface DiaryFilterDialogProps {
    onClose: () => void;
    tagsFilter: Tag[];
    setTagsFilter: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const DiaryFilterDialog = ({ onClose, tagsFilter, setTagsFilter }: DiaryFilterDialogProps) => {
    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent sx={{ pr: 0.5, pl: 0.5, pt: 2 }}>
                <TagSelect tags={tagsFilter} setTags={setTagsFilter} />
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
