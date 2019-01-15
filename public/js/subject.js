"use strict";

(() => {
  const select_all = document.getElementById("select_all");
  const subjects = document.getElementsByName("subject");

  select_all.addEventListener("click", ev => {
    subjects.forEach(subject => {
      subject.checked = select_all.checked;
    });
  });
})();
