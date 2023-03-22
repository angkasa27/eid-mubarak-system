import User from "../models/User.js";

const show = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) throw { code: 428, message: "username is required" };

    const user = await User.findOne({ username });

    return res.status(200).json({
      status: true,
      data: {
        username: user.username,
        enmail: user.enmail,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: "GET_PROFILE_SUCCESS",
    });
  } catch (err) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

export default { show };
