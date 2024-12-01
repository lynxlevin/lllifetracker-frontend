import { useCallback, useContext, useState } from 'react';
import { TagAPI } from '../apis/TagAPI';
import { TagContext } from '../contexts/tag-context';

const useTagContext = () => {
    const tagContext = useContext(TagContext);

    const [isLoading, setIsLoading] = useState(false);

    const tags = tagContext.tagList;
    const clearTagsCache = () => {
        tagContext.setTagList(undefined);
    };

    const getTags = useCallback(() => {
        setIsLoading(true);
        TagAPI.list()
            .then(res => {
                tagContext.setTagList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [tagContext]);

    return {
        isLoading,
        tags,
        clearTagsCache,
        getTags,
    };
};

export default useTagContext;
