import { useCallback, useContext, useState } from 'react';
import { TagAPI } from '../apis/TagAPI';
import { TagContext, SetTagContext } from '../contexts/tag-context';
import type { Tag } from '../types/tag';
import { blueGrey } from '@mui/material/colors';
import useGlobalErrorContext from './useGlobalErrorContext';

const useTagContext = () => {
    const tagContext = useContext(TagContext);
    const setTagContext = useContext(SetTagContext);
    const { handleAPIError } = useGlobalErrorContext();

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
            .catch(handleAPIError)
            .finally(() => {
                setIsLoading(false);
            });
    }, [handleAPIError, setTagContext]);

    const getTagColor = (tag: Tag): string => {
        switch (tag.type) {
            case 'Ambition':
                return 'ambitions.100';
            case 'Direction':
                return 'directions.100';
            case 'Action':
                return 'actions.100';
            case 'Plain':
                return blueGrey[100];
        }
    };

    const createTag = async (name: string) => {
        await TagAPI.create(name)
            .then(_ => {
                getTags();
            })
            .catch(_ => {});
    };

    const updateTag = async (tag_id: string, name: string) => {
        await TagAPI.update(tag_id, name)
            .then(_ => {
                getTags();
            })
            .catch(_ => {});
    };

    const deleteTag = async (tag_id: string) => {
        await TagAPI.delete(tag_id)
            .then(_ => {
                getTags();
            })
            .catch(_ => {});
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
