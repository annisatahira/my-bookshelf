const generatedID = () => {
  return `${+new Date()}`;
};

const addBook = () => {
  const titleBook = document.getElementById("title-book");
  const authorBook = document.getElementById("author-book");
  const yearBook = document.getElementById("year-book");
  const isFinished = document.getElementById("finished-book-checked");

  const bookID = generatedID();
  const unfinishedBookList = document.getElementById(UNFINISHED_LIST_BOOK_ID);
  const finishedBookList = document.getElementById(FINISHED_LIST_BOOK_ID);
  const book = makeBook({
    id: bookID,
    title: titleBook.value,
    author: authorBook.value,
    year: yearBook.value,
    isComplete: isFinished.checked,
  });

  isFinished ? finishedBookList.append(book) : unfinishedBookList.append(book);

  saveBookToArray({
    id: bookID,
    title: titleBook.value,
    author: authorBook.value,
    year: yearBook.value,
    isComplete: isFinished.checked,
  });

  document.dispatchEvent(new Event(RENDER_BOOK));

  // save data to local storage
  saveDataToStorage();

  //clear input
  titleBook.value = "";
  authorBook.value = "";
  yearBook.value = "";
  isFinished.checked = false;
};

const makeBook = ({ id, title, author, year, isComplete }) => {
  const bookContainer = document.createElement("div");
  const infoContainer = document.createElement("div");
  const bookTitle = document.createElement("h1");
  const bookAuthor = document.createElement("h2");
  const bookYear = document.createElement("h3");

  bookTitle.innerText = title;
  bookAuthor.innerText = author;
  bookYear.innerText = year;

  bookContainer.classList.add("book-item");

  infoContainer.append(bookTitle, bookAuthor, bookYear);
  bookContainer.append(infoContainer);
  bookContainer.setAttribute("id", `book-${id}`);

  if (isComplete) {
    bookContainer.append(createUndoButton(id), createOpenModalDeleteBook(id));
  } else {
    bookContainer.append(
      createFinishedButton(id),
      createOpenModalDeleteBook(id)
    );
  }

  return bookContainer;
};

const searchBook = () => {
  const titleBook = document.getElementById("title-search").value;
  let filteredBook = books;

  if (titleBook === "") {
    filteredBook = books;
  } else {
    filteredBook = books.filter(
      (book) => book.title.includes(titleBook) === true
    );
  }

  renderFilteredBook(filteredBook);
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

const createOpenModalDeleteBook = (id) => {
  return createButton("book-item__btn-delete", "Delete", (event) => {
    confrimDeleteBookElement({
      bookElement: event.target.parentElement,
      bookId: id,
    });
  });
};

const createDeletedBook = (bookElement, id) => {
  return createButton("book-item__btn-delete", "Delete", () => {
    removeBookElement({
      bookElement: bookElement,
      bookId: id,
    });
  });
};

const createCancelledButton = (bookElement) => {
  return createButton("book-item__btn-cancel", "Cancel", () => {
    cancelledDeleteBook({
      bookElement,
    });
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

const confrimDeleteBookElement = ({ bookElement, bookId }) => {
  // open modal to confrim whether user want to delete book or not
  const modalContainer = document.querySelector(".modal-container");
  const modalButtonWrapper = document.querySelector(".modal-button");
  modalContainer.style.display = "block";

  // clear modal button
  modalButtonWrapper.innerHTML = "";

  const titleBook = bookElement.querySelector("h1").innerText;
  const authorBook = bookElement.querySelector("h2").innerText;
  const yearBook = bookElement.querySelector("h3").innerText;

  const titleModal = document.querySelector(
    ".modal-content .modal__title-book"
  );
  const authorModal = document.querySelector(
    ".modal-content .modal__author-book"
  );
  const yearModal = document.querySelector(".modal-content .modal__year-book");

  titleModal.innerText = titleBook;
  authorModal.innerText = authorBook;
  yearModal.innerText = yearBook;

  modalButtonWrapper.append(
    createDeletedBook(bookElement, bookId),
    createCancelledButton(bookElement)
  );
};

const removeBookElement = ({ bookElement, bookId }) => {
  const bookTarget = findIndex({ id: bookId, data: books });

  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  bookTarget.isComplete ? finishedBooksCount-- : unfinishedBooksCount--;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveDataToStorage();

  bookElement.remove();

  const modalContainer = document.querySelector(".modal-container");
  modalContainer.style.display = "none";
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
  finishedBooksCount--;
  targetBook.isComplete = false;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveDataToStorage();
  bookElement.remove();
};

const cancelledDeleteBook = () => {
  const modalContainer = document.querySelector(".modal-container");
  modalContainer.style.display = "none";
};

const renderFilteredBook = (books) => {
  const unfinishedBookList = document.getElementById(UNFINISHED_LIST_BOOK_ID);
  const finishedBookList = document.getElementById(FINISHED_LIST_BOOK_ID);

  // clearing list item
  unfinishedBookList.innerHTML = "";
  finishedBookList.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      finishedBookList.append(bookElement);
    } else {
      unfinishedBookList.append(bookElement);
    }
  }
};
