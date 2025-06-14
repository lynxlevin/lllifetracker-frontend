export const moveItemUp = <T,>(arr: T[], idx: number): T[] => {
    return [...arr.slice(0, idx - 1), arr[idx], arr[idx - 1], ...arr.slice(idx + 1, arr.length)];
};

export const moveItemDown = <T,>(arr: T[], idx: number): T[] => {
    return [...arr.slice(0, idx), arr[idx + 1], arr[idx], ...arr.slice(idx + 2, arr.length)];
};
