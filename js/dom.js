/* {
  id: string | number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
} */

const UNFINISHED_LIST_BOOK_ID = "books";

const addBook = () => {
  const titleBook = document.getElementById("title-book").value;
  const authorBook = document.getElementById("author-book").value;
  const yearBook = document.getElementById("year-book").value;
  console.log("todo" + titleBook);
  console.log("authorBook" + authorBook);
  console.log("yearBook" + yearBook);

  const unfinishedBookList = document.getElementById(UNFINISHED_LIST_BOOK_ID);
  const book = makeBook({
    title: titleBook,
    author: authorBook,
    year: yearBook,
  });
  unfinishedBookList.append(book);
};

const makeBook = ({ title, author, year }) => {
  const bookContainer = document.createElement("div");
  const infoContainer = document.createElement("div");
  const bookTitle = document.createElement("h1");
  const bookAuthor = document.createElement("h2");
  const bookYear = document.createElement("h3");
  const bookButtonWrapper = document.createElement("div");
  const bookButtonFinished = document.createElement("p");
  const bookButtonDelete = document.createElement("p");

  bookTitle.innerText = title;
  bookAuthor.innerText = author;
  bookYear.innerText = year;

  bookButtonFinished.innerText = "Finished";
  bookButtonDelete.innerText = "Delete";

  bookContainer.classList.add("unfinished-book__item");
  bookButtonWrapper.classList.add("unfinished-book__item-btn-wrapper");
  bookButtonFinished.classList.add("unfinished-book__item-btn-finished");
  bookButtonDelete.classList.add("unfinished-book__item-btn-delete");

  infoContainer.append(bookTitle, bookAuthor, bookYear);
  bookButtonWrapper.append(bookButtonFinished, bookButtonDelete);
  bookContainer.append(infoContainer, bookButtonWrapper);

  return bookContainer;
};
