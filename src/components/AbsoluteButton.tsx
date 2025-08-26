import { Fade, IconButton } from '@mui/material';

const AbsoluteButton = ({
    onClick,
    size,
    bottom,
    right,
    icon,
    visible = true,
}: {
    onClick: React.Dispatch<React.SetStateAction<any>>;
    size: 'small' | 'medium' | 'large';
    bottom: number;
    right: number;
    icon: JSX.Element;
    visible?: boolean;
}) => {
    return (
        <Fade in={visible}>
            <IconButton
                onClick={onClick}
                size={size}
                sx={{
                    position: 'absolute',
                    bottom,
                    right,
                    borderRadius: '100%',
                    backgroundColor: 'rgba(256, 256, 256, 0.4)',
                    border: '1px solid #bbb',
                }}
            >
                {icon}
            </IconButton>
        </Fade>
    );
};

export default AbsoluteButton;
