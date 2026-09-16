document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("distForm");
  const note = document.getElementById("distFormNote");
  if (!form || !note) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      note.textContent = "Please fill in all fields before submitting.";
      note.classList.remove("is-success");
      note.classList.add("is-error");
      return;
    }
    note.textContent = "Thanks — your enquiry has been noted. Our team will be in touch shortly.";
    note.classList.remove("is-error");
    note.classList.add("is-success");
    form.reset();
  });
});
