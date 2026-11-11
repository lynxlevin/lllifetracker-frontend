import { format } from "date-fns";
import { DiaryAPI } from "../apis/DiaryAPI";
import useGlobalErrorContext from "./useGlobalErrorContext";
import useJournalContext from "./useJournalContext";

const useDiaryAPI = () => {
    const { getJournals } = useJournalContext();
    const { handleAPIErrorThrowing } = useGlobalErrorContext();

    const createDiary = async (text: string | null, date: Date, tag_ids: string[]) => {
        await DiaryAPI.create({ text, date: format(date, "yyyy-MM-dd"), tag_ids })
            .then((_) => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    const updateDiary = async (id: string, text: string | null, date: Date, tag_ids: string[]) => {
        await DiaryAPI.update(id, { text, date: format(date, "yyyy-MM-dd"), tag_ids })
            .then((_) => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    const deleteDiary = async (id: string) => {
        await DiaryAPI.delete(id)
            .then((_) => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    return {
        createDiary,
        updateDiary,
        deleteDiary,
    };
};

export default useDiaryAPI;
