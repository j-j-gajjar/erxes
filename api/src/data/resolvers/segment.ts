import { Segments } from '../../db/models';
import { ISegmentDocument } from '../../db/models/definitions/segments';
import { fetchSegment } from '../modules/segments/queryBuilder';

export default {
  getSubSegments(segment: ISegmentDocument) {
    return Segments.find({ subOf: segment._id });
  },

  count(segment: ISegmentDocument) {
    return fetchSegment('count', segment);
  }
};
