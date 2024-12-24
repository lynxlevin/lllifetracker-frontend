import CommonTabBar from './CommonTabBar';

const pathNames = [
    { name: '/ambitions', label: '大望' },
    { name: '/objectives', label: '目標' },
    { name: '/actions', label: '行動' },
];

const AmbitionsTabBar = () => {
    return <CommonTabBar pathNames={pathNames} />;
};

export default AmbitionsTabBar;
