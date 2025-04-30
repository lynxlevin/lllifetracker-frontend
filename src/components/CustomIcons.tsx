import FlareIcon from '@mui/icons-material/Flare';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import InsightsIcon from '@mui/icons-material/Insights';

export type IconSize = 'small' | 'medium';

interface CustomIconProps {
    size?: IconSize;
}

const getSize = (size: IconSize) => {
    switch (size) {
        case 'small':
            return { p: 0.2, fontSize: 18, mr: 0.5 };
        case 'medium':
            return { p: 0.3, fontSize: 24, mt: 0.4, mr: 0.5 };
    }
};

export const AmbitionIcon = ({ size = 'medium' }: CustomIconProps) => {
    return <FlareIcon sx={{ backgroundColor: 'ambitions.100', borderRadius: 100, display: 'inline', ...getSize(size) }} />;
};

export const DesiredStateIcon = ({ size = 'medium' }: CustomIconProps) => {
    return <AutoAwesomeIcon sx={{ backgroundColor: 'desiredStates.100', borderRadius: 100, display: 'inline', ...getSize(size) }} />;
};

export const MindsetIcon = ({ size = 'medium' }: CustomIconProps) => {
    return <SelfImprovementIcon sx={{ backgroundColor: 'mindsets.100', borderRadius: 100, display: 'inline', ...getSize(size) }} />;
};

export const ActionIcon = ({ size = 'medium' }: CustomIconProps) => {
    return <InsightsIcon sx={{ backgroundColor: 'actions.100', borderRadius: 100, display: 'inline', ...getSize(size) }} />;
};
