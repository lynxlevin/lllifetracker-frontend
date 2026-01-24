import { Box } from '@mui/material';
import { memo, ReactNode, useState } from 'react';

interface HorizontalSwipeBoxProps {
    children: ReactNode;
    onSwipeRight?: (swiped: boolean) => void;
    onSwipeLeft?: (swiped: boolean) => void;
    distance?: number;
}

const HorizontalSwipeBox = ({ children, onSwipeRight, onSwipeLeft, distance = 75 }: HorizontalSwipeBoxProps) => {
    const [startX, setStartX] = useState(0);
    return (
        <Box
            onTouchStart={event => {
                setStartX(event.touches[0].pageX);
            }}
            onTouchMove={event => {
                const x = event.touches[0].pageX - startX;
                if (x < -distance) {
                    if (onSwipeLeft !== undefined) onSwipeLeft(true);
                    if (onSwipeRight !== undefined) onSwipeRight(false);
                } else if (x > distance) {
                    if (onSwipeLeft !== undefined) onSwipeLeft(false);
                    if (onSwipeRight !== undefined) onSwipeRight(true);
                }
            }}
        >
            {children}
        </Box>
    );
};

export default memo(HorizontalSwipeBox);
