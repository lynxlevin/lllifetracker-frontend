import { Box, Button, Dialog, DialogContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { Tag } from '../../../types/tag';
import type { ThinkingNote } from '../../../types/journal';
import useThinkingNoteAPI from '../../../hooks/useThinkingNoteAPI';
import TagSelect from '../../../components/TagSelect';
import DialogWithAppBar from '../../../components/DialogWithAppBar';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import AbsoluteButton from '../../../components/AbsoluteButton';

interface ThinkingNoteDialogProps {
    onClose: () => void;
    thinkingNote?: ThinkingNote;
}

type DialogType = 'Focus';

const ThinkingNoteDialog = ({ onClose, thinkingNote }: ThinkingNoteDialogProps) => {
    const [question, setQuestion] = useState(thinkingNote ? thinkingNote.question : '');
    const [thought, setThought] = useState(thinkingNote ? thinkingNote.thought : '');
    const [answer, setAnswer] = useState(thinkingNote ? thinkingNote.answer : '');
    const [tags, setTags] = useState<Tag[]>(thinkingNote ? thinkingNote.tags : []);

    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { createThinkingNote, updateActiveThinkingNote } = useThinkingNoteAPI();

    const handleSubmit = () => {
        const tagIds = tags.map(tag => tag.id);
        if (thinkingNote === undefined) {
            createThinkingNote({
                question,
                thought,
                answer,
                tag_ids: tagIds,
            });
        } else {
            updateActiveThinkingNote(thinkingNote.id, {
                question,
                thought,
                answer,
                tag_ids: tagIds,
                resolved_at: thinkingNote.resolved_at,
            });
        }
        onClose();
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Focus':
                return (
                    <Dialog open onClose={onClose} fullScreen>
                        <DialogContent sx={{ padding: 2 }}>
                            <Box>
                                <TextField value={thought} onChange={event => setThought(event.target.value)} label="考察" multiline fullWidth minRows={10} />
                            </Box>
                            <AbsoluteButton onClick={() => setOpenedDialog(undefined)} bottom={10} right={25} size="small" icon={<CloseFullscreenIcon />} />
                        </DialogContent>
                    </Dialog>
                );
        }
    };

    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterContent={<Typography>思索ノート{thinkingNote === undefined ? '追加' : '編集'}</Typography>}
            content={
                <>
                    <TagSelect tags={tags} setTags={setTags} />
                    <TextField
                        value={question}
                        onChange={event => setQuestion(event.target.value)}
                        label="課題"
                        multiline
                        fullWidth
                        minRows={1}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        value={thought}
                        onChange={event => setThought(event.target.value)}
                        label="考察"
                        multiline
                        fullWidth
                        rows={8}
                        sx={{ mb: 2 }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <AbsoluteButton onClick={() => setOpenedDialog('Focus')} bottom={5} right={5} size="small" icon={<FullscreenIcon />} />
                                ),
                            },
                        }}
                    />
                    <TextField value={answer} onChange={event => setAnswer(event.target.value)} label="答え" multiline fullWidth minRows={1} sx={{ mb: 2 }} />
                    {openedDialog && getDialog()}
                </>
            }
            bottomPart={
                <>
                    <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant="contained" onClick={() => handleSubmit()}>
                        保存
                    </Button>
                </>
            }
            bgColor="white"
        />
    );
};

export default ThinkingNoteDialog;
