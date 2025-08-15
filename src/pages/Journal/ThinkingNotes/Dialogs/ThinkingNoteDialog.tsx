import { Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { Tag } from '../../../../types/tag';
import type { ThinkingNote } from '../../../../types/journal';
import useThinkingNoteContext from '../../../../hooks/useThinkingNoteContext';
import TagSelect from '../../../../components/TagSelect';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

interface ThinkingNoteDialogProps {
    onClose: () => void;
    thinkingNote?: ThinkingNote;
    startInFocusMode?: boolean;
}

const ThinkingNoteDialog = ({ onClose, thinkingNote, startInFocusMode = false }: ThinkingNoteDialogProps) => {
    const [question, setQuestion] = useState(thinkingNote ? thinkingNote.question : '');
    const [thought, setThought] = useState(thinkingNote ? thinkingNote.thought : '');
    const [answer, setAnswer] = useState(thinkingNote ? thinkingNote.answer : '');
    const [tags, setTags] = useState<Tag[]>(thinkingNote ? thinkingNote.tags : []);
    const [isFocusMode, setIsFocusMode] = useState(startInFocusMode);

    const { createThinkingNote, updateActiveThinkingNote } = useThinkingNoteContext();

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
            });
        }
        onClose();
    };

    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterContent={<Typography>思索ノート{thinkingNote === undefined ? '追加' : '編集'}</Typography>}
            appBarMenu={
                <>
                    <IconButton onClick={() => setIsFocusMode(prev => !prev)}>
                        <Stack alignItems="center" color={isFocusMode ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.37)'}>
                            <SelfImprovementIcon />
                            <Typography fontSize="0.5rem">集中モード</Typography>
                        </Stack>
                    </IconButton>
                </>
            }
            content={
                <>
                    <TextField
                        value={question}
                        onChange={event => setQuestion(event.target.value)}
                        label="課題"
                        multiline
                        fullWidth
                        minRows={1}
                        sx={{ mb: 2 }}
                    />
                    {!isFocusMode && (
                        <>
                            <TextField
                                value={answer}
                                onChange={event => setAnswer(event.target.value)}
                                label="答え"
                                multiline
                                fullWidth
                                minRows={1}
                                sx={{ mb: 2 }}
                            />
                            <TagSelect tags={tags} setTags={setTags} />
                        </>
                    )}
                    <TextField value={thought} onChange={event => setThought(event.target.value)} label="考察" multiline fullWidth rows={10} />
                </>
            }
            bottomPart={
                isFocusMode ? undefined : (
                    <>
                        <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                            キャンセル
                        </Button>
                        <Button variant="contained" onClick={() => handleSubmit()}>
                            保存
                        </Button>
                    </>
                )
            }
            bgColor="white"
        />
    );
};

export default ThinkingNoteDialog;
