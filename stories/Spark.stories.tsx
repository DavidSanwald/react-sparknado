import React from 'react';
import { Spark, Props } from '../src';
import {
  color,
  withKnobs,
  text,
  boolean,
  number,
  array,
  object,
} from '@storybook/addon-knobs';

export default {
  title: 'Welcome',
  component: Spark,
  includeStories: ['MyStory'],
  decorators: [withKnobs],
};

export const MyStory = (props: Partial<Props>) => {
  const data = object('data', [0, 10, 5, 22, 3.6, 11], 'data');
  const color1 = color('start','#0FF' , 'gradient');
  const color2 = color('middle', '#F0F', 'gradient');
  const color3 = color('stop','#FF0', 'gradient');
  const strokeWidth = number('stroke-width', 1);

  return <Spark data={data} strokeWidth={strokeWidth} gradient={[color1,color2,color3]} />;
};
