import { Box } from '@mui/material';
import { ReactNode, useState } from 'react';

interface HorizontalSwipeBoxProps {
    children: ReactNode;
    onSwipeRight?: (swiped: boolean) => void;
    onSwipeLeft?: (swiped: boolean) => void;
    distance: number;
    allowRepetitiveSwipe?: boolean;
}

const useHorizontalSwipe = () => {
    const [swipedLeft, setSwipedLeft] = useState(false);
    const [swipedRight, setSwipedRight] = useState(false);
    const cancelSwipe = () => {
        setSwipedLeft(false);
        setSwipedRight(false);
    };
    const HorizontalSwipeBox = ({ children, onSwipeRight, onSwipeLeft, distance, allowRepetitiveSwipe = false }: HorizontalSwipeBoxProps) => {
        const [startX, setStartX] = useState(0);
        const [isSwipeExecuted, setIsSwipeExecuted] = useState(false);

        const leftSwipe = (swiped: boolean) => {
            onSwipeLeft && onSwipeLeft(swiped);
            setSwipedLeft(swiped);
        };
        const rightSwipe = (swiped: boolean) => {
            onSwipeRight && onSwipeRight(swiped);
            setSwipedRight(swiped);
        };
        return (
            <Box
                onTouchStart={event => {
                    setStartX(event.touches[0].pageX);
                    setIsSwipeExecuted(false);
                }}
                onTouchMove={event => {
                    if (isSwipeExecuted) return;

                    const x = event.touches[0].pageX - startX;
                    const direction = x < -distance ? 'Left' : x > distance ? 'Right' : undefined;
                    if (direction !== undefined) setIsSwipeExecuted(true);
                    switch (direction) {
                        case 'Left':
                            if (allowRepetitiveSwipe) {
                                leftSwipe(true);
                            } else {
                                if (swipedLeft) break;
                                swipedRight ? rightSwipe(false) : leftSwipe(true);
                            }
                            break;
                        case 'Right':
                            if (allowRepetitiveSwipe) {
                                rightSwipe(true);
                            } else {
                                if (swipedRight) return;
                                swipedLeft ? leftSwipe(false) : rightSwipe(true);
                            }
                            break;
                    }
                }}
            >
                {children}
            </Box>
        );
    };

    return {
        swipedLeft,
        swipedRight,
        cancelSwipe,
        HorizontalSwipeBox,
    };
};

export default useHorizontalSwipe;
