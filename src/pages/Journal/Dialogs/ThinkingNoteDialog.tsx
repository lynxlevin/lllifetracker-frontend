import { Button, FormLabel, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import type { Tag } from '../../../types/tag';
import type { ThinkingNote } from '../../../types/journal';
import useThinkingNoteAPI from '../../../hooks/useThinkingNoteAPI';
import TagSelect from '../../../components/TagSelect';
import DialogWithAppBar from '../../../components/DialogWithAppBar';

interface ThinkingNoteDialogProps {
    onClose: () => void;
    thinkingNote: ThinkingNote;
}

const ThinkingNoteDialog = ({ onClose, thinkingNote }: ThinkingNoteDialogProps) => {
    const [question, setQuestion] = useState(thinkingNote.question);
    const [thought, setThought] = useState(thinkingNote.thought);
    const [answer, setAnswer] = useState(thinkingNote.answer);
    const [tags, setTags] = useState<Tag[]>(thinkingNote.tags);
    const [tagSelectHeight, setTagSelectHeight] = useState(65);
    const [questionInputHeight, setQuestionInputHeight] = useState(65);
    const [answerInputHeight, setAnswerInputHeight] = useState(65);
    const questionInputRef = useRef<HTMLDivElement>(null);
    const answerInputRef = useRef<HTMLDivElement>(null);

    const { updateActiveThinkingNote } = useThinkingNoteAPI();

    const handleSubmit = () => {
        const tagIds = tags.map(tag => tag.id);
        updateActiveThinkingNote(thinkingNote.id, {
            question,
            thought,
            answer,
            tag_ids: tagIds,
            resolved_at: thinkingNote.resolved_at,
        });
        onClose();
    };

    useEffect(() => {
        if (questionInputRef.current === null) return;
        setQuestionInputHeight(questionInputRef.current.getBoundingClientRect().height);
    }, [question]);
    useEffect(() => {
        if (answerInputRef.current === null) return;
        setAnswerInputHeight(answerInputRef.current.getBoundingClientRect().height);
    }, [answer]);
    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterText="思索ノート：編集"
            content={
                <>
                    <TagSelect tags={tags} setTags={setTags} bubbleHeight={setTagSelectHeight} />
                    <TextField
                        ref={questionInputRef}
                        value={question}
                        onChange={event => setQuestion(event.target.value)}
                        label="課題"
                        multiline
                        fullWidth
                        minRows={1}
                        sx={{ mt: 2 }}
                    />
                    <FormLabel sx={{ fontSize: '12px', ml: '14px' }}>考察</FormLabel>
                    <textarea
                        className="textarea-base"
                        value={thought ?? ''}
                        onChange={event => setThought(event.target.value)}
                        style={{
                            height: `calc(100svh - ${185 + tagSelectHeight + questionInputHeight + answerInputHeight}px)`,
                            width: '100%',
                            marginTop: '-3px',
                        }}
                    />
                    <TextField
                        ref={answerInputRef}
                        value={answer}
                        onChange={event => setAnswer(event.target.value)}
                        label="答え"
                        multiline
                        fullWidth
                        minRows={1}
                        sx={{ mt: 1 }}
                    />
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
