import { Typography } from '@mui/material';
import type { Variant } from '@mui/material/styles/createTypography';

interface CustomTypographyProps {
    name: string;
    description?: string | null;
    variant?: Variant;
    color: string;
}

const CustomTypography = ({ name, description, variant = 'body1', color }: CustomTypographyProps) => {
    return (
        <>
            <Typography variant={variant} sx={{ display: 'inline', pb: '2px', borderBottom: '2px solid', borderBottomColor: color }}>
                {name}
            </Typography>
            {description !== undefined && <Typography sx={{ marginLeft: 1 }}>{description ?? '　'}</Typography>}
        </>
    );
};

export const AmbitionTypography = ({ name, description, variant }: { name: string; description?: string | null; variant?: Variant }) => {
    return <CustomTypography name={name} description={description} color='ambitions.500' variant={variant} />;
};

export const ObjectiveTypography = ({ name, variant }: { name: string; variant?: Variant }) => {
    return <CustomTypography name={name} color='objectives.500' />;
};

export const ActionTypography = ({ name, variant }: { name: string; variant?: Variant }) => {
    return <CustomTypography name={name} color='actions.700' variant={variant} />;
};
