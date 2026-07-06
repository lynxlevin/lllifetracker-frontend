import { useCallback, useContext, useState } from 'react';
import { JournalAPI } from '../apis/JournalAPI';
import { JournalContext, SetJournalContext } from '../contexts/journal-context';
import { JOURNAL_SEARCH_PARAMS_DEFAULT } from '../types/journal';

const useJournalContext = () => {
    const journalContext = useContext(JournalContext);
    const setJournalContext = useContext(SetJournalContext);

    const [isLoading, setIsLoading] = useState(false);

    const journals = journalContext.journalList;
    const searchParams = journalContext.searchParams;
    const setSearchParams = setJournalContext.setSearchParams;
    const clearJournalsCache = () => {
        setJournalContext.setJournalList(undefined);
        setJournalContext.setSearchParams(JOURNAL_SEARCH_PARAMS_DEFAULT);
    };

    const getJournals = useCallback(() => {
        setIsLoading(true);
        JournalAPI.list({})
            .then(res => {
                setJournalContext.setJournalList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setJournalContext]);

    const searchJournals = () => {
        if (searchParams.isDefault) {
            getJournals();
        } else {
            const params = { text: searchParams.text, tag_ids: searchParams.tags.map(tag => tag.id) };
            JournalAPI.search(params).then(res => setJournalContext.setJournalList(res.data));
        }
    };

    return {
        isLoading,
        journals,
        searchParams,
        setSearchParams,
        clearJournalsCache,
        getJournals,
        searchJournals,
    };
};

export default useJournalContext;
