import styled from '@emotion/styled';
import { Box, Divider, IconButton } from '@mui/material';
import { useRef } from 'react';
import BasePage from '../../components/BasePage';
import TimerIcon from '@mui/icons-material/Timer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AmbitionsSection from './AmbitionsSection';
import DesiredStatesSection from './DesiredStatesSection';
import ActionsSection from './ActionsSection';
import MindsetsSection from './MindsetsSection';

const MyWay = () => {
    const trackButtonsRef = useRef<HTMLHRElement | null>(null);

    return (
        <BasePage pageName='MyWay'>
            <Box sx={{ pt: 4 }}>
                <AmbitionsSection />
                <Divider color='#ccc' sx={{ my: 1 }} />
                <DesiredStatesSection />
                <Divider color='#ccc' sx={{ my: 1 }} />
                <MindsetsSection />
                <Divider color='#ccc' sx={{ my: 1 }} ref={trackButtonsRef} />
                <ActionsSection />
                <ToLastAvailableTicketButton
                    onClick={() => {
                        trackButtonsRef.current && window.scrollTo({ top: trackButtonsRef.current.offsetTop - 50, behavior: 'smooth' });
                    }}
                >
                    <TimerIcon className='timer-icon' />
                    <ArrowDropDownIcon className='timer-arrow-icon' />
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
