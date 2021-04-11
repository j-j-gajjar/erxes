import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { withProps } from 'modules/common/utils';
import { SegmentsQueryResponse } from 'modules/segments/types';
import React from 'react';
import { graphql } from 'react-apollo';
import SegmentStep from '../components/step/SegmentStep';
import { queries } from '../graphql';

type Props = {
  segmentIds: string[];
  onChange: (name: string, value: string[]) => void;
};

type FinalProps = {
  segmentsQuery: SegmentsQueryResponse;
} & Props;

const SegmentStepContainer = (props: FinalProps) => {
  const { segmentsQuery } = props;

  const updatedProps = {
    ...props,
    segments: segmentsQuery.segments || []
  };

  return <SegmentStep {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<Props, SegmentsQueryResponse>(gql(queries.segments), {
      name: 'segmentsQuery',
      options: {
        variables: {
          contentTypes: [
            'lead',
            'customer',
            'visitor',
            'company',
            'deal',
            'ticket',
            'task'
          ]
        }
      }
    })
  )(SegmentStepContainer)
);
