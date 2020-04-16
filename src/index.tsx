/** @jsx jsx */
import React from 'react';
import { line, curveCatmullRom } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { jsx, css, keyframes } from '@emotion/core';

const draw = keyframes`
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}`;

function getRange(arr: number[]) {
  const min = arr.reduce((acc, curr) => Math.min(acc, curr), Infinity);
  const max = arr.reduce((acc, curr) => Math.max(acc, curr), -Infinity);
  return [min, max];
}

export type Props = {
  data: any;
  height?: number;
  width?: number;
  stroke?: string;
  padding?: number;
  gradient?: string[];
  drawDuration?: number;
  strokeWidth?: number;
};

const gradientId = 'myGradientId';

const Spark = ({
  // children,
  // width,
  // height,
  // viewBoxWidth,
  // viewBoxHeight,
  gradient,
  width,
  height,
  data,
  stroke = 'black',
  padding = 8,
  drawDuration = 2,
  strokeWidth = 1,
  ...props
}: Props) => {
  const viewBoxWidth = width || 300;
  const viewBoxHeight = height || 75;
  const svgWidth = width || '100%';
  const svgHeight = height || '25%';
  const xScale = scaleLinear()
    .range([0 + padding, viewBoxWidth - padding])
    .domain([0, data.length - 1]);
  const yScale = scaleLinear()
    .domain([0, getRange(data)[1]])
    .range([viewBoxHeight - padding, 0 + padding]);
  const lineGen = line<number>()
    .x((_, i) => xScale(i))
    .y(d => yScale(d))
    .curve(curveCatmullRom.alpha(0.5));
  const result = React.useMemo(() => {
    return lineGen(data);
  }, [data]);
  console.log(stroke);
  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
    >
      {gradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            {gradient
              .slice()
              .reverse()
              .map((c, i) => (
                <stop
                  key={i}
                  offset={i / (gradient.length - 1)}
                  stopColor={c}
                />
              ))}
          </linearGradient>
        </defs>
      )}

      {result && (
        <path
          d={result}
          pathLength="1"
          style={{
            fill: 'none',
          }}
          css={css`
            fill: none;
            stroke-width: ${strokeWidth};
            stroke: ${gradient ? `url(#${gradientId})` : stroke};
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: ${draw} ${drawDuration}s ease infinite;
          `}
          {...props}
        />
      )}
    </svg>
  );
};

export { Spark };
