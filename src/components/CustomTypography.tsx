import { Box, Typography } from '@mui/material';
import type { Variant } from '@mui/material/styles/createTypography';
import { ActionIcon, AmbitionIcon, ObjectiveIcon } from './CustomIcons';

interface CustomTypographyProps {
    name: string;
    description?: string | null;
    variant?: Variant;
    icon: JSX.Element;
}

const CustomTypography = ({ name, description, variant = 'body1', icon }: CustomTypographyProps) => {
    return (
        <>
            <Box sx={{ pr: 2 }}>
                {icon}
                <Typography variant={variant} sx={{ display: 'inline', pl: 0.5 }}>
                    {name}
                </Typography>
            </Box>
            {description && <Typography sx={{ marginLeft: 1, whiteSpace: 'pre-wrap' }}>{description}</Typography>}
        </>
    );
};

export const AmbitionTypography = ({ name, description, variant }: { name: string; description?: string | null; variant?: Variant }) => {
    return <CustomTypography icon={<AmbitionIcon size='small' />} name={name} description={description} variant={variant} />;
};

export const ObjectiveTypography = ({ name, description, variant }: { name: string; description?: string | null; variant?: Variant }) => {
    return <CustomTypography icon={<ObjectiveIcon size='small' />} name={name} description={description} variant={variant} />;
};

export const ActionTypography = ({ name, description, variant }: { name: string; description?: string | null; variant?: Variant }) => {
    return <CustomTypography icon={<ActionIcon size='small' />} name={name} description={description} variant={variant} />;
};
