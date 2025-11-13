import styled from '@emotion/styled';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useActionContext from '../../../hooks/useActionContext';
import type { DurationsByAction } from '../../../types/action_track';
import { getDurationString } from '../../../hooks/useValueDisplay';

const BasicAggregation = ({ aggregations, selectedDatesCount }: { aggregations?: DurationsByAction[]; selectedDatesCount?: number }) => {
    const { actions } = useActionContext();
    return (
        <TableContainer component={Box}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <StyledTableCell align="right">時間・回数</StyledTableCell>
                        {selectedDatesCount !== undefined && <StyledTableCell align="right">1日平均</StyledTableCell>}
                        <StyledTableCell align="right">1回平均</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {actions?.map(action => {
                        const durationsByAction = aggregations?.find(agg => agg.action_id === action.id);
                        const duration = durationsByAction?.duration ?? 0;
                        return (
                            <TableRow key={action.id}>
                                <StyledTableCell component="th" scope="row">
                                    <span style={{ color: action.color }}>⚫︎</span>
                                    {action.name}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {action.track_type === 'TimeSpan' ? (getDurationString(duration) ?? '-') : (durationsByAction?.count ?? '-')}
                                </StyledTableCell>
                                {selectedDatesCount !== undefined && (
                                    <StyledTableCell align="right">
                                        {selectedDatesCount > 0 ? (getDurationString(duration / selectedDatesCount) ?? '-') : '-'}
                                    </StyledTableCell>
                                )}
                                <StyledTableCell align="right">
                                    {durationsByAction === undefined ? '-' : (getDurationString(duration / durationsByAction.count) ?? '-')}
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
