import { useCallback, useContext, useState } from 'react';
import { TagAPI } from '../apis/TagAPI';
import { TagContext, SetTagContext } from '../contexts/tag-context';

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

    return {
        isLoading,
        tags,
        clearTagsCache,
        getTags,
    };
};

export default useTagContext;
