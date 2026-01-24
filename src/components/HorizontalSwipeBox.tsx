import { Box } from '@mui/material';
import { memo, ReactNode, useState } from 'react';

interface HorizontalSwipeBoxProps {
    children: ReactNode;
    onSwipeRight?: (swiped: boolean) => void;
    onSwipeLeft?: (swiped: boolean) => void;
    distance?: number;
    keepSwipeState?: boolean;
}

const HorizontalSwipeBox = ({ children, onSwipeRight, onSwipeLeft, distance = 75, keepSwipeState = false }: HorizontalSwipeBoxProps) => {
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [swipedLeft, setSwipedLeft] = useState(false);
    const [swipedRight, setSwipedRight] = useState(false);
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
                            onSwipeLeft(true);
                            setSwipedLeft(true);
                        }
                    } else if (x > distance) {
                        if (swipedLeft) {
                            onSwipeLeft(false);
                            setSwipedLeft(false);
                        }
                    }
                }
                if (onSwipeRight !== undefined) {
                    if (x < -distance) {
                        if (swipedRight) {
                            onSwipeRight(false);
                            setSwipedRight(false);
                        }
                    } else if (x > distance) {
                        if (!swipedRight) {
                            onSwipeRight(true);
                            setSwipedRight(true);
                        }
                    }
                }
            }}
            onTouchEnd={_ => {
                if (!keepSwipeState) {
                    setSwipedLeft(false);
                    setSwipedRight(false);
                }
            }}
        >
            {children}
        </Box>
    );
};

export default memo(HorizontalSwipeBox);
