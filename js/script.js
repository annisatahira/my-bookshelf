const books = [];
const RENDER_BOOK = "render-book";

const generatedID = () => {
  return `book_${+new Date()}`;
};

document.addEventListener("DOMContentLoaded", function () {
  const saveBookForm = document.getElementById("form-add-book");

  saveBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});
