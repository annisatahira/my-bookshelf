/* {
  id: string | number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
} */

const books = [];
let finishedBooksCount = 0;
let unfinishedBooksCount = 0;
const RENDER_BOOK = "render-book";
const SAVED_BOOK = "saved-book";
const STORAGE_KEY = "MY_SHELFBOOK_APP";

const UNFINISHED_LIST_BOOK_ID = "books";
const FINISHED_LIST_BOOK_ID = "finished-books";

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

const loadBooksFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  console.log({ data });

  if (data !== null) {
    for (book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_BOOK));
};

// document.addEventListener(SAVED_BOOK, () => {
//   console.log("Data berhasil di simpan.");
// });

document.addEventListener(RENDER_BOOK, () => {
  const unfinishedBookList = document.getElementById(UNFINISHED_LIST_BOOK_ID);
  const finishedBookList = document.getElementById(FINISHED_LIST_BOOK_ID);

  // clearing list item
  unfinishedBookList.innerHTML = "";
  finishedBookList.innerHTML = "";
  finishedBooksCount = 0;
  unfinishedBooksCount = 0;

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      finishedBooksCount++;
      finishedBookList.append(bookElement);
    } else {
      unfinishedBooksCount++;
      unfinishedBookList.append(bookElement);
    }
  }

  const finishedContainer = document.getElementById("finished-books__empty");
  const unfinishedContainer = document.getElementById(
    "unfinished-books__empty"
  );

  if (finishedBooksCount > 0) {
    finishedContainer.style.display = "none";
  } else {
    finishedContainer.style.display = "flex";
  }

  if (unfinishedBooksCount > 0) {
    unfinishedContainer.style.display = "none";
  } else {
    unfinishedContainer.style.display = "flex";
  }

  console.log({ finishedBooksCount, unfinishedBooksCount });
});
