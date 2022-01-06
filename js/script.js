document.addEventListener("DOMContentLoaded", () => {
  const saveBookForm = document.getElementById("form-add-book");

  saveBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadBooksFromStorage();
  }
});
