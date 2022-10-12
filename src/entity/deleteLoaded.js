const getIdFromUrl = (path) => {
  const string = path;

  const from = string.lastIndexOf('/');

  const to = string.lastIndexOf('.');

  const result = string.substring(from + 1, to);

  return result;
};

module.exports = { getIdFromUrl };
