/* {
  id: string | number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
} */

const UNFINISHED_LIST_BOOK_ID = "books";
const FINISHED_LIST_BOOK_ID = "finished-books";

const generatedID = () => {
  return `${+new Date()}`;
};

const addBook = () => {
  const titleBook = document.getElementById("title-book").value;
  const authorBook = document.getElementById("author-book").value;
  const yearBook = document.getElementById("year-book").value;
  const isFinished = document.getElementById("finished-book-checked").checked;

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

const makeBook = ({ id, title, author, year, isComplete }) => {
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
  bookContainer.setAttribute("id", `book-${id}`);

  if (isComplete) {
    bookContainer.append(createUndoButton(id), createDeleteButton(id));
  } else {
    bookContainer.append(createFinishedButton(id), createDeleteButton(id));
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

const addBookToFinished = ({ bookElement, bookId }) => {
  const bookTitle = bookElement.querySelector("h1").innerText;
  const bookAuthor = bookElement.querySelector("h2").innerText;
  const bookYear = bookElement.querySelector("h3").innerText;

  const newBook = makeBook({
    id: bookId,
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isComplete: true,
  });

  const listFinishedBook = document.getElementById(FINISHED_LIST_BOOK_ID);
  listFinishedBook.append(newBook);

  // change status isComplete in local storage
  const bookTarget = findId({ id: bookId, data: books });

  if (bookTarget == null) return;
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveDataToStorage();
  bookElement.remove();
};

const createFinishedButton = (id) => {
  return createButton("book-item__btn-finished", "Finished", (event) => {
    addBookToFinished({ bookElement: event.target.parentElement, bookId: id });
  });
};

const createDeleteButton = (id) => {
  return createButton("book-item__btn-delete", "Delete", (event) => {
    removeBookElement({ bookElement: event.target.parentElement, bookId: id });
  });
};

const createUndoButton = (id) => {
  return createButton("book-item__btn-undo", "Unfinished", (event) => {
    undoBookFromFinished({
      bookElement: event.target.parentElement,
      bookId: id,
    });
  });
};

const removeBookElement = ({ bookElement, bookId }) => {
  const bookTarget = findIndex({ id: bookId, data: books });

  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_BOOK));
  saveDataToStorage();
  bookElement.remove();
};

const undoBookFromFinished = ({ bookElement, bookId }) => {
  const listUnfinishedBook = document.getElementById(UNFINISHED_LIST_BOOK_ID);
  const titleBook = bookElement.querySelector("h1").innerText;
  const authorBook = bookElement.querySelector("h2").innerText;
  const yearBook = bookElement.querySelector("h3").innerText;

  const newBook = makeBook({
    id: bookId,
    title: titleBook,
    author: authorBook,
    year: yearBook,
    isComplete: false,
  });

  listUnfinishedBook.append(newBook);

  // change status isComplete on local storage
  const targetBook = findId({ id: bookId, data: books });
  if (targetBook === null) return;
  targetBook.isComplete = false;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveDataToStorage();
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
