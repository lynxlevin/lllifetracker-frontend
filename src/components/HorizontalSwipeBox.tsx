import { Box } from '@mui/material';
import { memo, ReactNode, useEffect, useState } from 'react';

interface HorizontalSwipeBoxProps {
    children: ReactNode;
    onSwipeRight?: (swiped: boolean) => void;
    onSwipeLeft?: (swiped: boolean) => void;
    distance: number;
    keepSwipeState?: boolean;
    allowRepetitiveSwipe?: boolean;
    reRenderKey?: boolean;
}

const HorizontalSwipeBox = ({
    children,
    onSwipeRight,
    onSwipeLeft,
    distance,
    keepSwipeState = false,
    allowRepetitiveSwipe = false,
    reRenderKey = false,
}: HorizontalSwipeBoxProps) => {
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [swipedLeft, setSwipedLeft] = useState(false);
    const [swipedRight, setSwipedRight] = useState(false);
    const [innerReRenderKey, setInnerReRenderKey] = useState(reRenderKey);

    const leftSwipe = () => {
        onSwipeLeft && onSwipeLeft(true);
        keepSwipeState && setSwipedLeft(true);
    };
    const cancelLeftSwipe = (event: React.TouchEvent<HTMLDivElement>) => {
        onSwipeLeft && onSwipeLeft(false);
        keepSwipeState && setSwipedLeft(false);
        setStartX(event.touches[0].pageX);
        setStartY(event.touches[0].pageY);
    };

    const rightSwipe = () => {
        onSwipeRight && onSwipeRight(true);
        keepSwipeState && setSwipedRight(true);
    };
    const cancelRightSwipe = (event: React.TouchEvent<HTMLDivElement>) => {
        onSwipeRight && onSwipeRight(false);
        keepSwipeState && setSwipedRight(false);
        setStartX(event.touches[0].pageX);
        setStartY(event.touches[0].pageY);
    };

    useEffect(() => {
        if (reRenderKey !== innerReRenderKey) {
            setSwipedLeft(false);
            setSwipedRight(false);
            setInnerReRenderKey(reRenderKey);
        }
    }, [innerReRenderKey, reRenderKey]);
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
                const isLeftMove = x < -distance;
                const isRightMove = x > distance;
                if (onSwipeLeft && onSwipeRight === undefined) {
                    if (isLeftMove) {
                        if (!swipedLeft) {
                            leftSwipe();
                        }
                    } else if (isRightMove) {
                        if (swipedLeft) {
                            cancelLeftSwipe(event);
                        }
                    }
                } else if (onSwipeRight && onSwipeLeft === undefined) {
                    if (isLeftMove) {
                        if (swipedRight) {
                            cancelRightSwipe(event);
                        }
                    } else if (isRightMove) {
                        if (!swipedRight) {
                            rightSwipe();
                        }
                    }
                } else if (onSwipeLeft && onSwipeRight) {
                    if (isLeftMove) {
                        if (!swipedLeft && !swipedRight) {
                            leftSwipe();
                        } else if (!swipedLeft && swipedRight) {
                            cancelRightSwipe(event);
                        }
                    } else if (isRightMove) {
                        if (!swipedRight && !swipedLeft) {
                            rightSwipe();
                        } else if (!swipedRight && swipedLeft) {
                            cancelLeftSwipe(event);
                        }
                    }
                }
            }}
            onTouchEnd={_ => {
                if (allowRepetitiveSwipe) {
                    setSwipedLeft(false);
                    setSwipedRight(false);
                }
            }}
            onTouchCancel={_ => {
                if (allowRepetitiveSwipe) {
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
