import Icon from 'modules/common/components/Icon';
import { __ } from 'modules/common/utils';
import {
  CustomerCounts,
  ListCounter,
  ListWrapper,
  SelectMessageType
} from 'modules/engage/styles';
import { SidebarCounter, SidebarList } from 'modules/layout/styles';
import { FlexItem } from 'modules/common/components/step/styles';
import { ISegment } from 'modules/segments/types';
import React from 'react';
import { ControlLabel } from 'modules/common/components/form';

type Props = {
  segmentIds: string[];
  segments: ISegment[];
};

const SegmentStep = (props: Props) => {
  const { segments } = props;

  const orderedSegments: ISegment[] = [];

  segments.forEach(segment => {
    if (!segment.subOf) {
      orderedSegments.push(segment, ...segment.getSubSegments);
    }
  });

  return (
    <FlexItem>
      <FlexItem direction="column" overflow="auto">
        <SelectMessageType>
          <ControlLabel>Choose segments:</ControlLabel>
        </SelectMessageType>

        <ListWrapper>
          <SidebarList>
            {orderedSegments.map(segment => (
              <ListCounter key={segment._id} chosen={false}>
                <a href="#counter" tabIndex={0}>
                  <Icon
                    icon="chart-pie"
                    style={{ color: segment.color, marginRight: '5px' }}
                  />{' '}
                  {segment.name}
                  <SidebarCounter>{segment.count}</SidebarCounter>
                </a>
              </ListCounter>
            ))}
          </SidebarList>
        </ListWrapper>
      </FlexItem>
      <FlexItem direction="column" v="center" h="center">
        <CustomerCounts>
          <Icon icon="users" size={50} />

          <p>
            {0} {__('customers')}
          </p>
        </CustomerCounts>
      </FlexItem>
    </FlexItem>
  );
};

export default SegmentStep;
