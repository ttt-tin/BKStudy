const User = require("../models/userModel");
const Course = require("../models/courseModel");
const Lesson = require("../models/lessonModel");
const Note = require("../models/noteModel");

const getProfile = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found !!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500; // Server error
    }
    next(err);
  }
};


const addProfile = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      const error = new Error("No image provided");
      error.statusCode = 422;
      throw error;
    }
    const imageUrl = req.file.path.replace("\\", "/");
    console.log(imageUrl);

    const { fullname, dateOfBirth, phoneNumber } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found !!");
      error.statusCode = 404;
      throw error;
    }

    user.avatar = imageUrl;
    user.fullname = fullname;
    user.dateOfBirth = dateOfBirth;
    user.phoneNumber = phoneNumber;

    await user.save();
    res.status(200).json({
      message: "User sign in successfully !!!",
      user
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500; // Server error
    }
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;

    const { fullname, dateOfBirth, phoneNumber, email } = req.body;
    const avatar = req.body.image;

    if (req.file) {
      avatar = req.file.path.replace("\\", "/");
    }
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found !!");
      error.statusCode = 404;
      throw error;
    }

    user.fullname = fullname;
    user.email = email;
    user.avatar = avatar;
    user.dateOfBirth = dateOfBirth;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      message: "Update user successfully !!!",
      user
    })
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500; // Server error
    }
    next(err);
  }
};

const registerCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.userId;
    const course = await Course.findById(courseId);
    if (!course) {
      const error = new Error("Course not found !!");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found !!");
      error.statusCode = 404;
      throw error;
    }

    //handle create note for each lesson in course
    for (let chapter of course.chapters) {
      for (let lesson of chapter.lessons) {
        let lessonId = lesson.lessonId;

        const note = await new Note({
          lessonId: lessonId,
          userId: user._id,
          contents: " ",
        });

        await note.save();
      }
    }
    //

    user.courses.push({
      courseId: course._id,
      enrolledDate: new Date()
    });
    await user.save();

    res.status(200).json({
      message: "Register course successfully !!!"
    })
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500; // Server error
    }
    next(err);
  }
}

const getCourses = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate('courses.courseId').exec();

    if (!user) {
      const error = new Error("User not found !!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ courses: user.courses });

  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500; // Server error
    }
    next(err);
  }
}

module.exports = {
  getProfile,
  addProfile,
  updateProfile,
  registerCourse,
  getCourses
};
