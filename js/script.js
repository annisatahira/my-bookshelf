document.addEventListener("DOMContentLoaded", () => {
  const saveBookForm = document.getElementById("form-add-book");
  const filterBookForm = document.getElementById("search-form");

  saveBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  filterBookForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadBooksFromStorage();
  }
});
