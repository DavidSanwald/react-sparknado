import React from 'react';
import { Spark, Props } from '../src';
import {
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

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const MyStory = (props: Partial<Props>) => {
  const data = object('data', [0, 10, 5, 22, 3.6, 11]);
  return <Spark data={data} gradient={['#0FF', '#F0F', '#FF0']} />;
};
