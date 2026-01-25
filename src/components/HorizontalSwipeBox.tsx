import { Box } from '@mui/material';
import { memo, ReactNode, useState } from 'react';

interface HorizontalSwipeBoxProps {
    children: ReactNode;
    onSwipeRight?: (swiped: boolean) => void;
    onSwipeLeft?: (swiped: boolean) => void;
    distance: number;
    keepSwipeState?: boolean;
}

const HorizontalSwipeBox = ({ children, onSwipeRight, onSwipeLeft, distance, keepSwipeState = false }: HorizontalSwipeBoxProps) => {
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [swipedLeft, _setSwipedLeft] = useState(false);
    const [swipedRight, _setSwipedRight] = useState(false);

    const setSwipedLeft = (swiped: boolean) => {
        onSwipeLeft !== undefined && onSwipeLeft(swiped);
        keepSwipeState && _setSwipedLeft(swiped);
    };
    const setSwipedRight = (swiped: boolean) => {
        onSwipeRight !== undefined && onSwipeRight(swiped);
        keepSwipeState && _setSwipedRight(swiped);
    };
    return (
        <Box
            onTouchStart={event => {
                setStartX(event.touches[0].pageX);
                setStartY(event.touches[0].pageY);
            }}
            onTouchMove={event => {
                const x = event.touches[0].pageX - startX;
                const y = event.touches[0].pageY - startY;
                if (Math.abs(y) > distance) return;
                if (onSwipeLeft !== undefined) {
                    if (x < -distance) {
                        if (!swipedLeft) {
                            setSwipedLeft(true);
                        }
                    } else if (x > distance) {
                        if (swipedLeft) {
                            setSwipedLeft(false);
                        }
                    }
                }
                if (onSwipeRight !== undefined) {
                    if (x < -distance) {
                        if (swipedRight) {
                            setSwipedRight(false);
                        }
                    } else if (x > distance) {
                        if (!swipedRight) {
                            setSwipedRight(true);
                        }
                    }
                }
            }}
        >
            {children}
        </Box>
    );
};

export default memo(HorizontalSwipeBox);
