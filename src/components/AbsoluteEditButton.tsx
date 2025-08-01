import { Fade, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const AbsoluteEditButton = ({
    onClick,
    size,
    bottom,
    right,
    visible = true,
}: {
    onClick: React.Dispatch<React.SetStateAction<any>>;
    size: 'small' | 'medium' | 'large';
    bottom: number;
    right: number;
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
                    backgroundColor: '#fbfbfb',
                    border: '1px solid #bbb',
                }}
            >
                <EditIcon fontSize={size} />
            </IconButton>
        </Fade>
    );
};

export default AbsoluteEditButton;
