const { listAllUsers } = require('../../../services/firebase');

const countAllUsers = async (req, res, next) => {
  try {
    const totalUsersCounter = await listAllUsers();
    res.json({ data: { totalUsersCounter } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  countAllUsers,
};
