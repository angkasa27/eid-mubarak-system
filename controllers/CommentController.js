import Comment from "../models/Comment.js";

const store = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) throw { code: 428, message: "Id is required" };

    const { name, message } = req.body;
    if (!name) throw { code: 428, message: "name is required" };
    if (!message) throw { code: 428, message: "message is required" };

    const newComment = new Comment({
      name,
      username,
      message,
    });

    const comment = await newComment.save();

    if (!comment) throw { code: 500, message: "Gagal Mengirim Pesan" };

    return res.status(200).json({
      status: true,
      data: comment,
      message: "Berhasil Terkirim",
    });
  } catch (err) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

const index = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) throw { code: 428, message: "Id is required" };

    const comments = await Comment.find({ username, status: "active" }).sort({
      createdAt: -1,
    });

    if (!comments) throw { code: 500, message: "Gagal Mengambil Pesan" };

    return res.status(200).json({
      status: true,
      data: comments,
      message: "Berhasil",
    });
  } catch (err) {
    if (!err.code) err.code = 500;
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

export default { store, index };
