export const loginUser = async (req, res) => {
  const { name } = req.body;

  let user = await User.findOne({ name });

  if (!user) {
    user = await User.create({ name });
  }

  res.json({ userId: user._id, name: user.name });
};