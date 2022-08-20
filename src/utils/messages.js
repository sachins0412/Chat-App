const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date(),
  };
};

const generateLocationMessage = (location) => {
  return {
    url: location,
    createAt: new Date(),
  };
};

module.exports = { generateMessage, generateLocationMessage };
