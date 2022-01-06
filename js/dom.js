/* {
  id: string | number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
} */

// const books = [];
const UNFINISHED_LIST_BOOK_ID = "books";
const FINISHED_LIST_BOOK_ID = "finished-books";

const generatedID = () => {
  return `book_${+new Date()}`;
};

// const generateBookObject = ({ id, title, author, year, isComplete }) => {
//   return {
//     id,
//     title,
//     author,
//     year,
//     isComplete,
//   };
// };

const addBook = () => {
  const titleBook = document.getElementById("title-book").value;
  const authorBook = document.getElementById("author-book").value;
  const yearBook = document.getElementById("year-book").value;
  const isFinished = document.getElementById("finished-book-checked").checked;

  // const bookObject = generateBookObject({
  //   id: bookID,
  //   title: titleBook,
  //   author: authorBook,
  //   year: yearBook,
  //   isComplete: isFinished,
  // });
  // books.push(bookObject);
  const bookID = generatedID();
  const unfinishedBookList = document.getElementById(UNFINISHED_LIST_BOOK_ID);
  const finishedBookList = document.getElementById(FINISHED_LIST_BOOK_ID);
  const book = makeBook({
    id: bookID,
    title: titleBook,
    author: authorBook,
    year: yearBook,
    isComplete: isFinished,
  });

  isFinished ? finishedBookList.append(book) : unfinishedBookList.append(book);

  saveBookToArray({
    id: bookID,
    title: titleBook,
    author: authorBook,
    year: yearBook,
    isComplete: isFinished,
  });

  document.dispatchEvent(new Event(RENDER_BOOK));

  // save data to local storage
  saveDataToStorage();
};

const makeBook = ({ title, author, year, isComplete }) => {
  const bookContainer = document.createElement("div");
  const infoContainer = document.createElement("div");
  const bookTitle = document.createElement("h1");
  const bookAuthor = document.createElement("h2");
  const bookYear = document.createElement("h3");
  const bookButtonWrapper = document.createElement("div");
  const bookButtonDelete = document.createElement("p");

  bookTitle.innerText = title;
  bookAuthor.innerText = author;
  bookYear.innerText = year;

  bookButtonDelete.innerText = "Delete";

  bookContainer.classList.add("book-item");
  bookButtonWrapper.classList.add("book-item__btn-wrapper");
  bookButtonDelete.classList.add("book-item__btn-delete");

  infoContainer.append(bookTitle, bookAuthor, bookYear);
  bookContainer.append(infoContainer);
  // bookContainer.setAttribute("id", `todo-${id}`);

  if (isComplete) {
    bookContainer.append(createUndoButton(), createDeleteButton());
  } else {
    bookContainer.append(createFinishedButton(), createDeleteButton());
  }

  return bookContainer;
};

const createButton = (buttonTypeClass, label, eventListener) => {
  const button = document.createElement("button");

  button.innerText = label;
  button.classList.add(buttonTypeClass);

  button.addEventListener("click", (event) => {
    eventListener(event);
  });
  return button;
};

const addBookToFinished = (bookElement) => {
  const bookTitle = bookElement.querySelector("h1").innerText;
  const bookAuthor = bookElement.querySelector("h2").innerText;
  const bookYear = bookElement.querySelector("h3").innerText;

  const newBook = makeBook({
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isComplete: true,
  });

  const listFinishedBook = document.getElementById(FINISHED_LIST_BOOK_ID);
  listFinishedBook.append(newBook);
  bookElement.remove();
};

const createFinishedButton = () => {
  return createButton("book-item__btn-finished", "Finished", (event) => {
    addBookToFinished(event.target.parentElement);
  });
};

const createDeleteButton = () => {
  return createButton("book-item__btn-delete", "Delete", (event) => {
    removeBookFromFinished(event.target.parentElement);
  });
};

const createUndoButton = () => {
  return createButton("book-item__btn-undo", "Unfinished", (event) => {
    undoBookFromFinished(event.target.parentElement);
  });
};

const removeBookFromFinished = (bookElement) => {
  bookElement.remove();
};

const undoBookFromFinished = (bookElement) => {
  const listUnfinishedBook = document.getElementById(UNFINISHED_LIST_BOOK_ID);
  const titleBook = bookElement.querySelector("h1").innerText;
  const authorBook = bookElement.querySelector("h2").innerText;
  const yearBook = bookElement.querySelector("h3").innerText;

  const newBook = makeBook({
    title: titleBook,
    author: authorBook,
    year: yearBook,
    isComplete: false,
  });

  listUnfinishedBook.append(newBook);
  bookElement.remove();
};

const createEmptyListContainer = () => {
  const emptyListContainer = document.createElement("div");
  const emoticon = document.createElement("i");
  const description = document.createElement("p");

  emptyListContainer.classList.add("unfinished-books__empty");
  emoticon.classList.add("fa fa-meh-o");

  description.innerText = "You haven't added a book yet";

  emptyListContainer.append(emoticon, description);
};
