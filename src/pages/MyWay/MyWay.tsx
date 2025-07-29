import styled from '@emotion/styled';
import { Box, Divider, IconButton } from '@mui/material';
import { useRef } from 'react';
import BasePage from '../../components/BasePage';
import TimerIcon from '@mui/icons-material/Timer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DesiredStatesSectionV2 from './DesiredStatesSectionV2';
import ActionsSectionV2 from './ActionsSectionV2';
import AmbitionsSectionV2 from './AmbitionsSectionV2';

const MyWay = () => {
    const trackButtonsRef = useRef<HTMLHRElement | null>(null);

    return (
        <BasePage pageName="MyWay">
            <Box sx={{ pt: 4 }}>
                <AmbitionsSectionV2 />
                <Divider color="#ccc" sx={{ my: 1 }} />
                <DesiredStatesSectionV2 />
                <Divider color="#ccc" sx={{ my: 1 }} ref={trackButtonsRef} />
                <ActionsSectionV2 />
                <ToLastAvailableTicketButton
                    onClick={() => {
                        trackButtonsRef.current && window.scrollTo({ top: trackButtonsRef.current.offsetTop - 50, behavior: 'smooth' });
                    }}
                >
                    <TimerIcon className="timer-icon" />
                    <ArrowDropDownIcon className="timer-arrow-icon" />
                </ToLastAvailableTicketButton>
            </Box>
        </BasePage>
    );
};

const ToLastAvailableTicketButton = styled(IconButton)`
    font-size: 30px;
    background: white !important;
    border-radius: 999px;
    position: fixed;
    left: 16px;
    bottom: 60px;
    border: 2px solid #ddd;
    width: 40px;
    height: 40px;
    z-index: 100;

    .timer-icon {
        position: fixed;
        left: 24px;
        bottom: 70px;
    }

    .timer-arrow-icon {
        position: fixed;
        left: 24px;
        bottom: 57px;
    }
`;

export default MyWay;
