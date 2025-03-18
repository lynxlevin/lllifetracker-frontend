import { useCallback, useContext, useState } from 'react';
import { TagAPI } from '../apis/TagAPI';
import { TagContext, SetTagContext } from '../contexts/tag-context';
import type { Tag, TagColor } from '../types/tag';

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

    const getTagColor = (tag: Tag): TagColor => {
        switch (tag.tag_type) {
            case 'Ambition':
                return 'ambitions.100';
            case 'DesiredState':
                return 'desiredStates.100';
            case 'Action':
                return 'actions.100';
        }
    };

    return {
        isLoading,
        tags,
        clearTagsCache,
        getTags,
        getTagColor,
    };
};

export default useTagContext;
