import styled from '@emotion/styled';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useActionContext from '../../../hooks/useActionContext';
import type { DurationsByAction } from '../../../types/action_track';

const BasicAggregation = ({ aggregations, selectedDatesCount }: { aggregations?: DurationsByAction[]; selectedDatesCount?: number }) => {
    const { actions } = useActionContext();

    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };
    const getDuration = (duration?: number) => {
        if (duration === undefined || duration === 0) return '-';
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        return `${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    };
    return (
        <TableContainer component={Box}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <StyledTableCell align='right'>時間・回数</StyledTableCell>
                        {selectedDatesCount !== undefined && <StyledTableCell align='right'>1日平均</StyledTableCell>}
                        <StyledTableCell align='right'>1回平均</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {actions
                        ?.filter(action => action.trackable)
                        .map(action => {
                            const durationsByAction = aggregations?.find(agg => agg.action_id === action.id);
                            const duration = durationsByAction?.duration ?? 0;
                            return (
                                <TableRow key={action.id}>
                                    <StyledTableCell component='th' scope='row'>
                                        <span style={{ color: action.color }}>⚫︎</span>
                                        {action.name}
                                    </StyledTableCell>
                                    <StyledTableCell align='right'>
                                        {action.track_type === 'TimeSpan' ? getDuration(duration) : (durationsByAction?.count ?? '-')}
                                    </StyledTableCell>
                                    {selectedDatesCount !== undefined && (
                                        <StyledTableCell align='right'>
                                            {selectedDatesCount > 0 ? getDuration(duration / selectedDatesCount) : '-'}
                                        </StyledTableCell>
                                    )}
                                    <StyledTableCell align='right'>
                                        {durationsByAction === undefined ? '-' : getDuration(duration / durationsByAction.count)}
                                    </StyledTableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const StyledTableCell = styled(TableCell)`
    padding-right: 0;
    padding-left: 0;
`;

export default BasicAggregation;
