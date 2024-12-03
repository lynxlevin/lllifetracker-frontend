import { Typography } from '@mui/material';
import type { Variant } from '@mui/material/styles/createTypography';
import { ActionIcon, AmbitionIcon, ObjectiveIcon } from './CustomIcons';

interface CustomTypographyProps {
    name: string;
    description?: string | null;
    variant?: Variant;
}

const CustomTypography = ({ name, description, variant = 'body1' }: CustomTypographyProps) => {
    return (
        <>
            <Typography variant={variant} sx={{ display: 'inline', pl: 0.5 }}>
                {name}
            </Typography>
            {description && <Typography sx={{ marginLeft: 1, whiteSpace: 'pre-wrap' }}>{description}</Typography>}
        </>
    );
};

export const AmbitionTypography = ({ name, description, variant }: { name: string; description?: string | null; variant?: Variant }) => {
    return (
        <>
            <AmbitionIcon size='small' />
            <CustomTypography name={name} description={description} variant={variant} />
        </>
    );
};

export const ObjectiveTypography = ({ name, description, variant }: { name: string; description?: string | null; variant?: Variant }) => {
    return (
        <>
            <ObjectiveIcon size='small' />
            <CustomTypography name={name} description={description} variant={variant} />
        </>
    );
};

export const ActionTypography = ({ name, description, variant }: { name: string; description?: string | null; variant?: Variant }) => {
    return (
        <>
            <ActionIcon size='small' />
            <CustomTypography name={name} description={description} variant={variant} />
        </>
    );
};
