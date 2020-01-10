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

const SCHEDULE_QUERY = gql`
  query ScheduleQuery(
    $termId: String!
  ) {
    schedule(
      termId: $termId
    ) {
      courseName
      sectionId
      sectionTitle
      firstMeetingDate
      lastMeetingDate
      instructors
      meetings {
        building
        buildingId
        room
        dates {
          start
          end
          startTime
          endTime
        }
      }
    }
  }
`;

module.exports = {
  USER_QUERY,
  TERMS_QUERY,
  SCHEDULE_QUERY,
};
