import { styled } from '@mui/material';
import { orange } from '@mui/material/colors';
import type { Action } from '../../../types/my_way';
import type { DurationsByAction } from '../../../types/action_track';
import { type BarLabelProps, BarPlot, ChartContainer, ChartsXAxis, ChartsYAxis, useAnimate } from '@mui/x-charts';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import type { AggregationBarGraphMax } from '../../../hooks/useLocalStorage';
import { useCallback, useEffect, useMemo } from 'react';
import { getDurationString } from '../../../hooks/useValueDisplay';

const AggregationsBarGraph = ({
    aggregationByDay,
    days,
    selectedAction,
    barGraphMax,
    setBarGraphMax,
}: {
    aggregationByDay: DurationsByAction[][];
    days: Date[];
    selectedAction: Action;
    barGraphMax: AggregationBarGraphMax;
    setBarGraphMax: (max: AggregationBarGraphMax) => void;
}) => {
    const getMax = useCallback(() => {
        return selectedAction.track_type === 'TimeSpan' ? (barGraphMax[selectedAction.id]?.duration ?? 1800) : (barGraphMax[selectedAction.id]?.count ?? 5);
    }, [barGraphMax, selectedAction]);

    const aggData = useMemo(() => {
        return aggregationByDay.map(dateAgg =>
            selectedAction.track_type === 'TimeSpan'
                ? (dateAgg.find(agg => agg.action_id === selectedAction.id)?.duration ?? 0)
                : (dateAgg.find(agg => agg.action_id === selectedAction.id)?.count ?? 0),
        );
    }, [aggregationByDay, selectedAction]);

    useEffect(() => {
        const max = Math.max(...aggData);
        if (max <= getMax()) return;

        const itemToSet =
            selectedAction.track_type === 'TimeSpan' ? { duration: (Math.floor(max / 3600) + 1) * 3600 } : { count: (Math.floor(max / 10) + 1) * 10 };
        setBarGraphMax({ ...barGraphMax, [selectedAction.id]: itemToSet });
    }, [aggData, barGraphMax, getMax, selectedAction, setBarGraphMax]);
    return (
        <>
            <ChartContainer
                height={150}
                width={400}
                style={{ translate: '-55px 0' }}
                series={[
                    {
                        data: aggData,
                        label: selectedAction.track_type === 'TimeSpan' ? '時間(分)' : '回数',
                        type: 'bar',
                    },
                ]}
                colors={[selectedAction.color ?? orange[500]]}
                xAxis={[
                    {
                        scaleType: 'band',
                        data: days.map(date => date.getDate()),
                    },
                ]}
                yAxis={[
                    {
                        max: getMax(),
                    },
                ]}
            >
                <BarPlot
                    barLabel={(item, _) => {
                        return selectedAction.track_type === 'TimeSpan' ? getDurationString(item.value, true) : item.value === 0 ? '' : item.value?.toString();
                    }}
                    slots={{ barLabel: BarLabel }}
                />
                <ChartsXAxis disableTicks />
                <ChartsYAxis tickLabelStyle={{ display: 'none' }} disableLine disableTicks />
            </ChartContainer>
        </>
    );
};

const Text = styled('text')(({ theme }) => ({
    ...theme?.typography?.body2,
    stroke: 'none',
    fill: (theme.vars || theme)?.palette?.text?.primary,
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    pointerEvents: 'none',
}));

function BarLabel(props: BarLabelProps) {
    const { seriesId, dataIndex, color, isFaded, isHighlighted, classes, xOrigin, yOrigin, x, y, width, height, layout, skipAnimation, ...otherProps } = props;

    const animatedProps = useAnimate(
        { x: x + width / 2, y: y - 8 },
        {
            initialProps: { x: x + width / 2, y: yOrigin },
            createInterpolator: interpolateObject,
            transformProps: p => p,
            applyProps: (element: SVGTextElement, p) => {
                element.setAttribute('x', p.x.toString());
                element.setAttribute('y', p.y.toString());
            },
            skip: skipAnimation,
        },
    );

    return <Text {...otherProps} fill={color} textAnchor='middle' {...animatedProps} style={{ fontSize: '9px' }} />;
}

export default AggregationsBarGraph;
