import { Box, Chip, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import type { Tag, TagType } from '../types/tag';
import useTagContext from '../hooks/useTagContext';
import { ActionIcon, AmbitionIcon, ObjectiveIcon } from '../components/CustomIcons';

interface TagSelectProps {
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const TagSelect = ({ tags, setTags }: TagSelectProps) => {
    const { tags: tagsMaster } = useTagContext();

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

    if (!tagsMaster) {
        return <></>;
    }
    return (
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
    );
};

export default TagSelect;