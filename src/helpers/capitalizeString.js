export const capitalizeString = str => {
  return str.replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
};
