const User = require('../models/User');

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { instituteName, idNumber, year, branch } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { instituteName, idNumber, year, branch },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // Return JSON response
    }
    res.json({ message: 'User details updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return JSON response
  }
};

module.exports = { updateUser };