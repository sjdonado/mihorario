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

module.exports = {
  USER_QUERY,
  TERMS_QUERY,
};
