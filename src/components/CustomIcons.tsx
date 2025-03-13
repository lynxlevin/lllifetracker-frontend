import FlareIcon from '@mui/icons-material/Flare';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InsightsIcon from '@mui/icons-material/Insights';

interface CustomIconProps {
    size?: 'small' | 'medium' | 'large';
}

const getSize = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
        case 'small':
            return { p: 0.2, fontSize: 18 };
        case 'medium':
            return { p: 0.3, fontSize: 28 };
        case 'large':
            return { p: 0.3, fontSize: 32 };
    }
};

export const AmbitionIcon = ({ size = 'medium' }: CustomIconProps) => {
    return <FlareIcon sx={{ backgroundColor: 'ambitions.100', borderRadius: 100, display: 'inline', ...getSize(size) }} />;
};

export const DesiredStateIcon = ({ size = 'medium' }: CustomIconProps) => {
    return <AutoAwesomeIcon sx={{ backgroundColor: 'desiredStates.100', borderRadius: 100, display: 'inline', ...getSize(size) }} />;
};

export const ActionIcon = ({ size = 'medium' }: CustomIconProps) => {
    return <InsightsIcon sx={{ backgroundColor: 'actions.100', borderRadius: 100, display: 'inline', ...getSize(size) }} />;
};
