import { Stack, Typography } from '@mui/material';
import type { TypographyVariant } from '@mui/material/styles/createTypography';
import { ActionIcon, AmbitionIcon, DesiredStateIcon, MindsetIcon, type IconSize } from './CustomIcons';

interface CustomTypographyProps {
    name: string;
    description?: string | null;
    variant?: TypographyVariant;
    icon: JSX.Element;
}

const CustomTypography = ({ name, description, variant = 'body1', icon }: CustomTypographyProps) => {
    return (
        <>
            <Stack direction='row' alignItems='center' sx={{ pr: 2 }}>
                {icon}
                <Typography variant={variant} sx={{ display: 'inline', pl: 0.5 }}>
                    {name}
                </Typography>
            </Stack>
            {description && <Typography sx={{ marginLeft: 1, whiteSpace: 'pre-wrap' }}>{description}</Typography>}
        </>
    );
};

export const AmbitionTypography = ({
    name,
    description,
    variant,
    iconSize = 'small',
}: { name: string; description?: string | null; variant?: TypographyVariant; iconSize?: IconSize }) => {
    return <CustomTypography icon={<AmbitionIcon size={iconSize} />} name={name} description={description} variant={variant} />;
};

export const DesiredStateTypography = ({
    name,
    description,
    variant,
    iconSize = 'small',
}: { name: string; description?: string | null; variant?: TypographyVariant; iconSize?: IconSize }) => {
    return <CustomTypography icon={<DesiredStateIcon size={iconSize} />} name={name} description={description} variant={variant} />;
};

export const MindsetTypography = ({
    name,
    description,
    variant,
    iconSize = 'small',
}: { name: string; description?: string | null; variant?: TypographyVariant; iconSize?: IconSize }) => {
    return <CustomTypography icon={<MindsetIcon size={iconSize} />} name={name} description={description} variant={variant} />;
};

export const ActionTypography = ({
    name,
    description,
    variant,
    iconSize = 'small',
}: { name: string; description?: string | null; variant?: TypographyVariant; iconSize?: IconSize }) => {
    return <CustomTypography icon={<ActionIcon size={iconSize} />} name={name} description={description} variant={variant} />;
};
