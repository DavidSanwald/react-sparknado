/** @jsx jsx */
import React from 'react';
import CSS from 'csstype';
import { line, area, curveCatmullRomOpen } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { jsx, css, keyframes } from '@emotion/core';

function getRange(arr: number[]) {
  const min = arr.reduce((acc, curr) => Math.min(acc, curr), Infinity);
  const max = arr.reduce((acc, curr) => Math.max(acc, curr), -Infinity);
  return [min, max];
}

export type Props = {
  data: any;
  height?: number;
  width?: number;
  style?: CSS.Properties;
  padding?: number;
  gradient?: string[];
  drawDuration?: number;
  curve?: number;
  className?: string;
  kind?: 'area' | 'line';
};

const gradientId = 'myGradientId';

const builtDefaultStyles = ({ drawDuration = 1 } = {}) => {
  const draw = keyframes`
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}`;
  return css`
    animation: ${draw} ${drawDuration}s ease infinite;
  `;
};

const Spark = ({
  style,
  gradient,
  width,
  height,
  data,
  curve = 0.5,
  padding = 8,
  drawDuration = 2,
  kind = 'line',
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
  const shapeGen = React.useMemo(() => {
    return kind === 'line'
      ? line<number>()
          .x((_, i) => xScale(i))
          .y(d => yScale(d))
      : area<number>()
          .x((_, i) => xScale(i))
          .y0(viewBoxHeight - padding)
          .y1(d => yScale(d))
          .curve(curveCatmullRomOpen.alpha(curve));
  }, []);
  const result = React.useMemo(() => {
    return shapeGen(data);
  }, [data, shapeGen]);
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
                  stopOpacity={1 - (i / gradient.length) * 2}
                />
              ))}
          </linearGradient>
        </defs>
      )}

      {result && (
        <path
          d={result}
          pathLength="1"
          style={{ ...style }}
          css={css`
            ${builtDefaultStyles()};
            fill: none;
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            fill: ${gradient ? `url(#${gradientId})` : '1px'};
          `}
          {...props}
        />
      )}
    </svg>
  );
};

export { Spark };
