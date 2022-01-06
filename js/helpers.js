const findIndex = ({ id, data }) => {
  for (index in data) {
    if (data[index].id === id) {
      return index;
    }
  }
  return -1;
};

function findId({ id, data }) {
  for (item of data) {
    if (item.id === id) {
      return item;
    }
  }
  return null;
}
