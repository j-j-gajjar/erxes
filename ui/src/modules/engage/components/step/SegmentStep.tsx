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
  defaultValues: string[];
  onChange: (ids: string[]) => void;
  segments: ISegment[];
};

type State = {
  selectedIds: string[];
};
class SegmentStep extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = { selectedIds: [] };
  }

  componentDidMount() {
    const { defaultValues } = this.props;

    if (defaultValues !== []) {
      this.setState({ selectedIds: defaultValues });
    }
  }

  onClick = (selectedId: string) => {
    const { selectedIds } = this.state;

    if (!selectedIds.includes(selectedId)) {
      const updatedIds = [...selectedIds, selectedId];

      this.setState({ selectedIds: updatedIds }, () => {
        this.props.onChange(updatedIds);
      });
    } else {
      const filteredIds = selectedIds.filter(target => target !== selectedId);

      this.setState({ selectedIds: filteredIds }, () => {
        this.props.onChange(filteredIds);
      });
    }
  };

  render() {
    const { segments } = this.props;
    const { selectedIds } = this.state;

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
                <ListCounter
                  key={segment._id}
                  chosen={selectedIds.includes(segment._id)}
                >
                  <a
                    href="#counter"
                    tabIndex={0}
                    onClick={this.onClick.bind(this, segment._id)}
                  >
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
  }
}

export default SegmentStep;
