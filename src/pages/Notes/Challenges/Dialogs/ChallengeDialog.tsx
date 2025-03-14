import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { Tag } from '../../../../types/tag';
import type { Challenge } from '../../../../types/challenge';
import useChallengeContext from '../../../../hooks/useChallengeContext';
import TagSelect from '../../../../components/TagSelect';

interface ChallengeDialogProps {
    onClose: () => void;
    challenge?: Challenge;
}

const ChallengeDialog = ({ onClose, challenge }: ChallengeDialogProps) => {
    const [title, setTitle] = useState(challenge ? challenge.title : '');
    const [text, setText] = useState(challenge ? challenge.text : '');
    const [date, setDate] = useState<Date>(challenge ? new Date(challenge.date) : new Date());
    const [tags, setTags] = useState<Tag[]>(challenge ? challenge.tags : []);

    const { createChallenge, updateChallenge } = useChallengeContext();

    const handleSubmit = () => {
        if (challenge === undefined) {
            createChallenge(
                title,
                text,
                date,
                tags.map(tag => tag.id),
            );
        } else {
            updateChallenge(
                challenge.id,
                title,
                text,
                date,
                tags.map(tag => tag.id),
            );
        }
        onClose();
    };

    const onChangeDate = (newDate: Date | null) => {
        if (newDate) {
            setDate(newDate);
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ pr: 0.5, pl: 0.5, pt: 2 }}>
                <MobileDatePicker label='日付' value={date} onChange={onChangeDate} showDaysOutsideCurrentMonth closeOnSelect sx={{ mb: 1 }} />
                <TagSelect tags={tags} setTags={setTags} />
                <TextField value={title} onChange={event => setTitle(event.target.value)} label='タイトル' multiline fullWidth minRows={1} sx={{ mb: 2 }} />
                <TextField value={text} onChange={event => setText(event.target.value)} label='内容' multiline fullWidth rows={10} />
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant='contained' onClick={handleSubmit}>
                        保存
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default ChallengeDialog;
