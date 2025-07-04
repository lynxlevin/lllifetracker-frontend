import { styled } from '@mui/material';
import { orange } from '@mui/material/colors';
import type { Action } from '../../types/my_way';
import type { DurationsByAction } from '../../types/action_track';
import { type BarLabelProps, BarPlot, ChartContainer, ChartsXAxis, ChartsYAxis, useAnimate } from '@mui/x-charts';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';

const AggregationsBarGraph = ({
    aggregationByDay,
    days,
    selectedAction,
}: { aggregationByDay: DurationsByAction[][]; days: Date[]; selectedAction: Action }) => {
    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };
    const getDuration = (minutesTotal: number | null) => {
        if (minutesTotal === null || minutesTotal === 0) return '';
        const hours = Math.floor(minutesTotal / 60);
        const minutes = Math.floor(minutesTotal % 60);
        return `${hours}:${zeroPad(minutes)}`;
    };
    return (
        <>
            <ChartContainer
                height={150}
                width={400}
                style={{ translate: '-55px 0' }}
                series={[
                    {
                        data: aggregationByDay.map(dateAgg =>
                            selectedAction.track_type === 'TimeSpan'
                                ? (dateAgg.find(agg => agg.action_id === selectedAction.id)?.duration ?? 0) / 60
                                : (dateAgg.find(agg => agg.action_id === selectedAction.id)?.count ?? 0),
                        ),
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
            >
                <BarPlot
                    barLabel={(item, _) => {
                        return selectedAction.track_type === 'TimeSpan' ? getDuration(item.value) : item.value === 0 ? '' : item.value?.toString();
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
