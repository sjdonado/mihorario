const gql = require('graphql-tag');

const USER_QUERY = gql`
{
  user {
    id
    name
    username
  }
}
`;

const TERMS_QUERY = gql`
  {
    terms {
      id
      name
      startDate
      endDate
    }
  }
`;

const GROUPED_SCHEDULE_QUERY = gql`
  query GroupedScheduleQuery(
    $start: Date!
    $end: Date!
  ) {
    groupedSchedule(
      start: $start
      end: $end
    ) {
      courseName
      sectionId
      sectionTitle
      meetings {
        building
        buildingId
        room
        dates {
          start
          end
        }
      }
    }
  }
`;

module.exports = {
  USER_QUERY,
  TERMS_QUERY,
  GROUPED_SCHEDULE_QUERY,
};
