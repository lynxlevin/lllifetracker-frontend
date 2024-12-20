import { useCallback, useContext, useState } from 'react';
import { format } from 'date-fns';
import { MissionMemoContext } from '../contexts/mission-memo-context';
import { MissionMemoAPI } from '../apis/MissionMemoAPI';

const useMissionMemoContext = () => {
    const missionMemoContext = useContext(MissionMemoContext);

    const [isLoading, setIsLoading] = useState(false);

    const missionMemos = missionMemoContext.missionMemoList;
    const clearMissionMemosCache = () => {
        missionMemoContext.setMissionMemoList(undefined);
    };

    const getMissionMemos = useCallback(() => {
        setIsLoading(true);
        MissionMemoAPI.list()
            .then(res => {
                missionMemoContext.setMissionMemoList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [missionMemoContext]);

    const createMissionMemo = (title: string, text: string, date: Date, tag_ids: string[]) => {
        MissionMemoAPI.create({ title, text, date: format(date, 'yyyy-MM-dd'), tag_ids }).then(_ => {
            getMissionMemos();
        });
    };

    const updateMissionMemo = (id: string, title: string, text: string, date: Date, tag_ids: string[]) => {
        MissionMemoAPI.update(id, { title, text, date: format(date, 'yyyy-MM-dd'), tag_ids }).then(_ => {
            getMissionMemos();
        });
    };

    const deleteMissionMemo = (id: string) => {
        MissionMemoAPI.delete(id).then(_ => {
            getMissionMemos();
        });
    };

    const archiveMissionMemo = (id: string) => {
        MissionMemoAPI.archive(id).then(_ => {
            getMissionMemos();
        });
    };

    const accomplishMissionMemo = (id: string) => {
        MissionMemoAPI.markAccomplished(id).then(_ => {
            getMissionMemos();
        });
    };

    return {
        isLoading,
        missionMemos,
        clearMissionMemosCache,
        getMissionMemos,
        createMissionMemo,
        updateMissionMemo,
        deleteMissionMemo,
        archiveMissionMemo,
        accomplishMissionMemo,
    };
};

export default useMissionMemoContext;
