import CommonTabBar from './CommonTabBar';

const pathNames = [
    { name: '/memos', label: 'メモ' },
    { name: '/mission-memos', label: '課題' },
    { name: '/book-excerpts', label: '本の抜粋' },
];

const MemosTabBar = () => {
    return <CommonTabBar pathNames={pathNames} />;
};

export default MemosTabBar;
