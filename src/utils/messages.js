const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date(),
  };
};

const generateLocationMessage = (username, location) => {
  return {
    username,
    url: location,
    createAt: new Date(),
  };
};

module.exports = { generateMessage, generateLocationMessage };
