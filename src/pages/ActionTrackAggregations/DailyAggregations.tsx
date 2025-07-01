import styled from '@emotion/styled';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, FormLabel } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import DatePicker, { type DateObject } from 'react-multi-date-picker';
import { ActionTrackAPI } from '../../apis/ActionTrackAPI';
import type { ActionTrackAggregation } from '../../types/action_track';

const DailyAggregations = () => {
    return (
        // <BasePage isLoading={isLoading} pageName='Aggregation'>
        <BasePage isLoading={false} pageName='Aggregation'>
            <Box sx={{ pb: 12, pt: 4 }}>Main contents here.</Box>
        </BasePage>
    );
};

export default DailyAggregations;
