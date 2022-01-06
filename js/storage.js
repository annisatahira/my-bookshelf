const books = [];
const RENDER_BOOK = "render-book";
const SAVED_BOOK = "saved-book";
const STORAGE_KEY = "MY_SHELFBOOK_APP";

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage");
    return false;
  }
  return true;
};

const generateBookObject = ({ id, title, author, year, isComplete }) => {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
};

const saveBookToArray = ({ id, title, author, year, isComplete }) => {
  const bookObject = generateBookObject({
    id,
    title,
    author,
    year,
    isComplete,
  });
  books.push(bookObject);
};

const saveDataToStorage = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_BOOK));
  }
};

document.addEventListener(SAVED_BOOK, () => {
  console.log("Data berhasil di simpan.");
});
