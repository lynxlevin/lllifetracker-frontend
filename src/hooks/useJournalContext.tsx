import { useCallback, useContext, useState } from 'react';
import { JournalAPI } from '../apis/JournalAPI';
import { JournalContext, SetJournalContext } from '../contexts/journal-context';
import { JOURNAL_SEARCH_PARAMS_DEFAULT, JournalSearchParams } from '../types/journal';

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

    const getJournals = useCallback(
        (paramsProp?: JournalSearchParams) => {
            setIsLoading(true);
            const params = paramsProp === undefined ? searchParams : paramsProp;
            if (params.status === 'Default') {
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
            } else {
                JournalAPI.search({ text: params.text, tag_ids: params.tags.map(tag => tag.id) }).then(res => setJournalContext.setJournalList(res.data));
            }
        },
        [searchParams, setJournalContext],
    );

    return {
        isLoading,
        journals,
        searchParams,
        setSearchParams,
        clearJournalsCache,
        getJournals,
    };
};

export default useJournalContext;
