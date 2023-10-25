const response = (statusCode, data, message, res) => {
  res.status(statusCode).json({
    payload: {
      status_code: statusCode,
      data,
      message,
    },
  });
};

module.exports = response;
