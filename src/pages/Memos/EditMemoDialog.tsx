import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
    TextField,
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { Memo } from '../../types/memo';
import useMemoContext from '../../hooks/useMemoContext';
import type { Tag, TagType } from '../../types/tag';
import useTagContext from '../../hooks/useTagContext';
import { ActionIcon, AmbitionIcon, ObjectiveIcon } from '../../components/CustomIcons';

interface EditMemoDialogProps {
    onClose: () => void;
    memo: Memo;
}

const EditMemoDialog = ({ onClose, memo }: EditMemoDialogProps) => {
    const [title, setTitle] = useState(memo.title);
    const [text, setText] = useState(memo.text);
    const [date, setDate] = useState<Date>(new Date(memo.date));
    const [tags, setTags] = useState<Tag[]>(memo.tags);

    const { updateMemo } = useMemoContext();
    const { tags: tagsMaster } = useTagContext();

    const handleSubmit = () => {
        updateMemo(
            memo.id,
            title,
            text,
            date,
            tags.map(tag => tag.id),
        );
        onClose();
    };

    const onChangeDate = (newDate: Date | null) => {
        if (newDate) {
            setDate(newDate);
        }
    };

    const getTagIcon = (tagType: TagType) => {
        switch (tagType) {
            case 'Ambition':
                return <AmbitionIcon size='small' />;
            case 'Objective':
                return <ObjectiveIcon size='small' />;
            case 'Action':
                return <ActionIcon size='small' />;
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <MobileDatePicker label='日付' value={date} onChange={onChangeDate} showDaysOutsideCurrentMonth closeOnSelect sx={{ mb: 1 }} />

                {tagsMaster && (
                    <FormControl sx={{ width: '100%', mb: 1 }}>
                        <InputLabel id='tags-select-label'>タグ</InputLabel>
                        <Select
                            labelId='tags-select-label'
                            label='tags'
                            multiple
                            value={tags.map(tag => tag.id)}
                            onChange={(event: SelectChangeEvent<string[]>) => {
                                const {
                                    target: { value },
                                } = event;
                                const tagIds = typeof value === 'string' ? value.split(',') : value;
                                setTags(cur =>
                                    tagIds.map((tagId: string) => {
                                        const exists = cur.find(c => c.id === tagId);
                                        if (exists) return exists;
                                        return tagsMaster.find(tag => tag.id === tagId)!;
                                    }),
                                );
                            }}
                            renderValue={selected => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map(value => {
                                        const tag = tagsMaster.find(tag => tag.id === value)!;
                                        return <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: `${tag.tag_type.toLowerCase()}s.100` }} />;
                                    })}
                                </Box>
                            )}
                        >
                            {tagsMaster.map(tag => (
                                <MenuItem key={tag.id} value={tag.id}>
                                    {getTagIcon(tag.tag_type)}
                                    {tag.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
                <TextField value={title} onChange={event => setTitle(event.target.value)} label='タイトル' multiline fullWidth minRows={1} sx={{ mb: 2 }} />
                <TextField value={text} onChange={event => setText(event.target.value)} label='内容' multiline fullWidth minRows={5} />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', py: 2 }}>
                <Button variant='contained' onClick={handleSubmit}>
                    修正する
                </Button>
                <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditMemoDialog;
