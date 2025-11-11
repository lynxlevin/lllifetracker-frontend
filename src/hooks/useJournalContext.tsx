import { useCallback, useContext, useState } from 'react';
import { JournalAPI } from '../apis/JournalAPI';
import { JournalContext, SetJournalContext } from '../contexts/journal-context';

const useJournalContext = () => {
    const journalContext = useContext(JournalContext);
    const setJournalContext = useContext(SetJournalContext);

    const [isLoading, setIsLoading] = useState(false);

    const journals = journalContext.journalList;
    const clearJournalsCache = () => {
        setJournalContext.setJournalList(undefined);
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

    return {
        isLoading,
        journals,
        clearJournalsCache,
        getJournals,
    };
};

export default useJournalContext;
