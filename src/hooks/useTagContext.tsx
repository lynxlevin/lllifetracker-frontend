import { useCallback, useContext, useState } from 'react';
import { TagAPI } from '../apis/TagAPI';
import { TagContext, SetTagContext } from '../contexts/tag-context';
import type { Tag } from '../types/tag';
import { blueGrey } from '@mui/material/colors';

const useTagContext = () => {
    const tagContext = useContext(TagContext);
    const setTagContext = useContext(SetTagContext);

    const [isLoading, setIsLoading] = useState(false);

    const tags = tagContext.tagList;
    const clearTagsCache = () => {
        setTagContext.setTagList(undefined);
    };

    const getTags = useCallback(() => {
        setIsLoading(true);
        TagAPI.list()
            .then(res => {
                setTagContext.setTagList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setTagContext]);

    const getTagColor = (tag: Tag): string => {
        switch (tag.tag_type) {
            case 'Ambition':
                return 'ambitions.100';
            case 'DesiredState':
                return 'desiredStates.100';
            case 'Mindset':
                return 'mindsets.100';
            case 'Action':
                return 'actions.100';
            case 'Plain':
                return blueGrey[100];
        }
    };

    const createTag = (name: string) => {
        TagAPI.create(name)
            .then(_ => {
                getTags();
            })
            .catch(e => console.error(e));
    };

    const updateTag = (tag_id: string, name: string) => {
        TagAPI.update(tag_id, name)
            .then(_ => {
                getTags();
            })
            .catch(e => console.error(e));
    };

    const deleteTag = (tag_id: string) => {
        TagAPI.delete(tag_id)
            .then(_ => {
                getTags();
            })
            .catch(e => console.error(e));
    };

    return {
        isLoading,
        tags,
        clearTagsCache,
        getTags,
        getTagColor,
        createTag,
        updateTag,
        deleteTag,
    };
};

export default useTagContext;
