import React, { useEffect, useState } from 'react';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import browserUsage, { BrowserUsage as Browsers } from '@visx/mock-data/lib/mocks/browserUsage';
import { animated, useTransition, interpolate } from 'react-spring';


interface SentimentUsage {
  label: NPNLabelType;
  usage: number;
}

const sentimentLabels: NPNLabelType[] = [ 'negative', 'neutral', 'positive' ]
const colorRange = [ "#F87171", "#93C5FD", "#34D399" ]
// accessor functions
const usage = (d: SentimentUsage) => d.usage;

// color scales
const getBrowserColor = scaleOrdinal({
  domain: sentimentLabels,
  range: colorRange,
});


const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export type PieProps = {
  width: number;
  height: number;
  sentimentDataVals: SentimentDataList;
  onClickArc: (label: NPNLabelType) => void
  margin?: typeof defaultMargin;
  animate?: boolean;
};

type SentimentDataList = { [type in NPNLabelType ]: number }
export default function PieChart({
  width,
  height,
  sentimentDataVals,
  margin = defaultMargin,
  onClickArc,
  animate = true,
}: PieProps) {
  const [selectedSentiment, setSelectSentiment] = useState<NPNLabelType | null>(null);

  let totalNumber = 0;
  const [sentimentTweetCount, setSentimentTweetCount] = useState<number>(totalNumber)

  const sentimentData: Array<SentimentUsage> = sentimentLabels.map(label => {
    // add the values;
    const sentimentCount = Number(sentimentDataVals[label])
    totalNumber = totalNumber + sentimentCount

    return ({
      label,
      usage: sentimentCount,
    })
  });

  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = 40;

  useEffect(() => {
    onClickArc(selectedSentiment)
    setSentimentTweetCount(selectedSentiment !== null ? sentimentDataVals[selectedSentiment]: totalNumber)
  }, [selectedSentiment])

  return (
      <div className="h-auto relative flex items-center justify-center">
            <svg width={width} height={height}>
            {/* <GradientPinkBlue id="visx-pie-gradient" /> */}
            {/* <rect rx={14} width={width} height={height} fill="url('#visx-pie-gradient')" /> */}
            <Group top={centerY + margin.top} left={centerX + margin.left}>
                <Pie
                  data={
                      selectedSentiment ? sentimentData.filter(({ label }) => label === selectedSentiment) : sentimentData
                  }
                  pieValue={usage}
                  outerRadius={radius}
                  innerRadius={radius - donutThickness}
                  cornerRadius={1}
                  padAngle={0.01}
                >
                {pie => (
                    <AnimatedPie<SentimentUsage>
                      {...pie}
                      animate={animate}
                      getKey={arc => arc.data.label}
                      onClickDatum={({ data: { label } }) => {
                        return (
                          animate &&
                          setSelectSentiment(selectedSentiment && selectedSentiment === label ? null : label)
                        )
                      }
                      }
                      getColor={arc => getBrowserColor(arc.data.label)}
                    />
                )}
                </Pie>
            </Group>
            </svg>
            <span className="absolute">
                <p className="text-center">
                    <span className="block text-3xl font-bold">{sentimentTweetCount}</span>
                    <span className="block px-1 text-gray-500 capitalize">{selectedSentiment || 'Total'}</span>
                    <span className="block px-1 text-gray-500">tweets</span>
                </p>
            </span>
      </div>
  );
}

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});

const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  delay?: number;
};

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(
    arcs,
    getKey,
    // @ts-ignore react-spring doesn't like this overload
    {
      from: animate ? fromLeaveTransition : enterUpdateTransition,
      enter: enterUpdateTransition,
      update: enterUpdateTransition,
      leave: animate ? fromLeaveTransition : enterUpdateTransition,
    },
  );
  return (
    <>
      {transitions.map(
        ({
          item: arc,
          props,
          key,
        }: {
          item: PieArcDatum<Datum>;
          props: AnimatedStyles;
          key: string;
        }) => {
          const [centroidX, centroidY] = path.centroid(arc);
          const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

          return (
            <g key={key}>
              <animated.path
                // compute interpolated path d attribute from intermediate angle values
                d={interpolate([props.startAngle, props.endAngle], (startAngle, endAngle) =>
                  path({
                    ...arc,
                    startAngle,
                    endAngle,
                  }),
                )}
                fill={getColor(arc)}
                onClick={() => onClickDatum(arc)}
                onTouchStart={() => onClickDatum(arc)}
              />
              {hasSpaceForLabel && (
                <animated.g style={{ opacity: props.opacity }}>
                  <text
                    x={centroidX}
                    y={centroidY}
                    dy=".33em"
                    className="font-sans text-gray-600"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {getKey(arc)}
                  </text>
                </animated.g>
              )}
            </g>
          );
        },
      )}
    </>
  );
}
