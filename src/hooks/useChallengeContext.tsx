import { useCallback, useContext, useState } from 'react';
import { format } from 'date-fns';
import { ChallengeContext, SetChallengeContext } from '../contexts/challenge-context';
import { ChallengeAPI } from '../apis/ChallengeAPI';

const useChallengeContext = () => {
    const challengeContext = useContext(ChallengeContext);
    const setChallengeContext = useContext(SetChallengeContext);

    const [isLoading, setIsLoading] = useState(false);

    const challenges = challengeContext.challengeList;
    const clearChallengesCache = () => {
        setChallengeContext.setChallengeList(undefined);
    };

    const getChallenges = useCallback(() => {
        setIsLoading(true);
        ChallengeAPI.list()
            .then(res => {
                setChallengeContext.setChallengeList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setChallengeContext]);

    const createChallenge = (title: string, text: string, date: Date, tag_ids: string[]) => {
        ChallengeAPI.create({ title, text, date: format(date, 'yyyy-MM-dd'), tag_ids }).then(_ => {
            getChallenges();
        });
    };

    const updateChallenge = (id: string, title: string, text: string, date: Date, tag_ids: string[]) => {
        ChallengeAPI.update(id, { title, text, date: format(date, 'yyyy-MM-dd'), tag_ids }).then(_ => {
            getChallenges();
        });
    };

    const deleteChallenge = (id: string) => {
        ChallengeAPI.delete(id).then(_ => {
            getChallenges();
        });
    };

    const archiveChallenge = (id: string) => {
        ChallengeAPI.archive(id).then(_ => {
            getChallenges();
        });
    };

    const accomplishChallenge = (id: string) => {
        ChallengeAPI.markAccomplished(id).then(_ => {
            getChallenges();
        });
    };

    return {
        isLoading,
        challenges,
        clearChallengesCache,
        getChallenges,
        createChallenge,
        updateChallenge,
        deleteChallenge,
        archiveChallenge,
        accomplishChallenge,
    };
};

export default useChallengeContext;
