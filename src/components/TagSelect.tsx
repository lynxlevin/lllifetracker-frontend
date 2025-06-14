import { Box, Chip, FormControl, InputLabel, ListSubheader, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import type { Tag } from '../types/tag';
import useTagContext from '../hooks/useTagContext';
import { ActionIcon, AmbitionIcon, DesiredStateIcon } from '../components/CustomIcons';

interface TagSelectProps {
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
}

const TagSelect = ({ tags, setTags }: TagSelectProps) => {
    const { tags: tagsMaster, getTagColor } = useTagContext();

    const getTagIcon = (tag: Tag) => {
        switch (tag.tag_type) {
            case 'Ambition':
                return <AmbitionIcon size='small' />;
            case 'DesiredState':
                return <DesiredStateIcon size='small' />;
            case 'Action':
                return <ActionIcon size='small' />;
            case 'Plain':
                return <div style={{ backgroundColor: getTagColor(tag), borderRadius: 100, height: '18px', width: '18px', marginRight: '4px' }} />;
        }
    };

    if (!tagsMaster) {
        return <></>;
    }
    const archivedTags = tags.filter(tag => tagsMaster.find(master => master.id === tag.id) === undefined);
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
                            const tag = [...tags, ...tagsMaster].find(tag => tag.id === value)!;
                            return <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />;
                        })}
                    </Box>
                )}
            >
                {tagsMaster.map(tag => (
                    <MenuItem key={tag.id} value={tag.id}>
                        {getTagIcon(tag)}
                        {tag.name}
                    </MenuItem>
                ))}
                {archivedTags.length > 0 && <ListSubheader>Archived</ListSubheader>}
                {archivedTags.map(tag => (
                    <MenuItem key={tag.id} value={tag.id}>
                        {getTagIcon(tag)}
                        {tag.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default TagSelect;
