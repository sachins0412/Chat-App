const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date(),
  };
};

const generateLocationMessage = (url) => {
  return {
    url,
    createAt: new Date(),
  };
};

module.exports = { generateMessage, generateLocationMessage };
