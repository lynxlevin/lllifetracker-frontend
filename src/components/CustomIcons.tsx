import CircleIcon from '@mui/icons-material/Circle';
import { blueGrey } from '@mui/material/colors';

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
    return <CircleIcon sx={{ backgroundColor: 'ambitions.100', color: 'ambitions.100', borderRadius: 100, display: 'inline', ...getSize(size) }} />;
};

export const DirectionIcon = ({ size = 'medium' }: CustomIconProps) => {
    return <CircleIcon sx={{ backgroundColor: 'directions.100', color: 'directions.100', borderRadius: 100, display: 'inline', ...getSize(size) }} />;
};

export const ActionIcon = ({ size = 'medium' }: CustomIconProps) => {
    return <CircleIcon sx={{ backgroundColor: 'actions.100', color: 'actions.100', borderRadius: 100, display: 'inline', ...getSize(size) }} />;
};

export const JournalIcon = ({ size = 'medium' }: CustomIconProps) => {
    return <CircleIcon sx={{ backgroundColor: blueGrey[100], color: blueGrey[100], borderRadius: 100, display: 'inline', ...getSize(size) }} />;
};
