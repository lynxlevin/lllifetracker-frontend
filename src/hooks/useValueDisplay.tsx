const zeroPad = (num: number) => {
    return num.toString().padStart(2, '0');
};
export const getDurationString = (totalSeconds?: number | null, removeSeconds?: boolean) => {
    if (totalSeconds === undefined || totalSeconds === 0 || totalSeconds === null) return undefined;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (removeSeconds) return `${hours}:${zeroPad(minutes)}`;
    return `${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
};
