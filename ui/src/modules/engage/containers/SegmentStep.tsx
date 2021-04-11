import gql from 'graphql-tag';
import client from 'apolloClient';
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

type State = {
  customersCount: number;
};

class SegmentStepContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = { customersCount: 0 };
  }

  render() {
    const { segmentsQuery, segmentIds } = this.props;

    const onChange = (ids: string[]) => {
      client
        .query({
          query: gql(queries.customerCounts),
          fetchPolicy: 'network-only',
          variables: { only: 'bySegment', source: 'engages', segmentIds: ids }
        })
        .then(({ data: { customerCounts } }) => {
          let totalCount = 0;
          const values: number[] = Object.values(customerCounts.bySegment);

          for (const count of values) {
            totalCount += count;
          }

          this.setState({ customersCount: totalCount });
        });

      this.props.onChange('segmentIds', ids);
    };

    const updatedProps = {
      defaultValues: segmentIds,
      segments: segmentsQuery.segments || [],
      customersCount: this.state.customersCount,
      onChange
    };

    return <SegmentStep {...updatedProps} />;
  }
}

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
