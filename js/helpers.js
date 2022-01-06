const findIndex = ({ id, data }) => {
  for (index in data) {
    if (data[index].id === id) {
      return index;
    }
  }
  return -1;
};
