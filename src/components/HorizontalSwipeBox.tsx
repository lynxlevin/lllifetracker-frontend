import { Box } from '@mui/material';
import { memo, ReactNode, useState } from 'react';

interface HorizontalSwipeBoxProps {
    children: ReactNode;
    setSwipedRight?: React.Dispatch<React.SetStateAction<boolean>>;
    setSwipedLeft?: React.Dispatch<React.SetStateAction<boolean>>;
    distance?: number;
}

const HorizontalSwipeBox = ({ children, setSwipedRight, setSwipedLeft, distance = 75 }: HorizontalSwipeBoxProps) => {
    const [startX, setStartX] = useState(0);
    return (
        <Box
            onTouchStart={event => {
                setStartX(event.touches[0].pageX);
            }}
            onTouchMove={event => {
                const x = event.touches[0].pageX - startX;
                if (x < -distance) {
                    if (setSwipedLeft !== undefined) setSwipedLeft(true);
                    if (setSwipedRight !== undefined) setSwipedRight(false);
                } else if (x > distance) {
                    if (setSwipedLeft !== undefined) setSwipedLeft(false);
                    if (setSwipedRight !== undefined) setSwipedRight(true);
                }
            }}
        >
            {children}
        </Box>
    );
};

export default memo(HorizontalSwipeBox);
