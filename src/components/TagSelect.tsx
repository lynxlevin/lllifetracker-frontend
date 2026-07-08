import { Box, Chip, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import type { Tag } from '../types/tag';
import useTagContext from '../hooks/useTagContext';
import { ActionIcon, AmbitionIcon, DirectionIcon } from '../components/CustomIcons';

interface TagSelectProps {
    tags: Tag[] | undefined;
    setTags: (tags: Tag[]) => void;
    tagsMasterProp?: Tag[];
}

const TagSelect = ({ tags, setTags, tagsMasterProp }: TagSelectProps) => {
    const { tags: tagsMasterContext, getTagColor } = useTagContext();

    const getTagIcon = (tag: Tag) => {
        switch (tag.type) {
            case 'Ambition':
                return <AmbitionIcon size="small" />;
            case 'Direction':
                return <DirectionIcon size="small" />;
            case 'Action':
                return <ActionIcon size="small" />;
            case 'Plain':
                return <div style={{ backgroundColor: getTagColor(tag), borderRadius: 100, height: '18px', width: '18px', marginRight: '4px' }} />;
        }
    };

    const tagsMaster = tagsMasterProp ?? tagsMasterContext;

    if (!tagsMaster) {
        return <></>;
    }
    return (
        <FormControl sx={{ width: '100%', mb: 2 }}>
            <InputLabel id="tags-select-label">タグ</InputLabel>
            <Select
                labelId="tags-select-label"
                label="tags"
                multiple
                value={tags?.map(tag => tag.id) ?? []}
                onChange={(event: SelectChangeEvent<string[]>) => {
                    const {
                        target: { value },
                    } = event;
                    const tagIds = typeof value === 'string' ? value.split(',') : value;
                    // NOTE: This `!` is necessary because TypeScript compiler doesn't take filter method into account and thinks it's (Tag | undefined)[]
                    setTags(tagIds.map(id => tagsMaster.find(tag => tag.id === id)!).filter(tag => tag !== undefined));
                }}
                renderValue={selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map(value => {
                            const tag = [...(tags ?? []), ...tagsMaster].find(tag => tag.id === value)!;
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
            </Select>
        </FormControl>
    );
};

export default TagSelect;
