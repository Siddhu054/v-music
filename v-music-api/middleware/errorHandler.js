const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(err.errors)
        .map((error) => error.message)
        .join(", "),
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: "This email or username is already taken",
    });
  }

  res.status(500).json({
    message: "Something went wrong!",
  });
};

module.exports = errorHandler;
