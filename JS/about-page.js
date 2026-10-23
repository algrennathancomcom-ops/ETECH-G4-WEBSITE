const projectDialog = document.querySelector(".about-project-dialog");
const projectDialogImage = projectDialog.querySelector(".about-project-dialog-image");
const projectDialogClose = projectDialog.querySelector(".about-project-dialog-close");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let projectDialogCloseTimer;

const closeProjectDialog = () => {
  if (!projectDialog.open) return;
  projectDialog.classList.remove("is-open");
  window.clearTimeout(projectDialogCloseTimer);
  projectDialogCloseTimer = window.setTimeout(
    () => projectDialog.close(),
    reduceMotion.matches ? 0 : 460,
  );
};

document.querySelectorAll(".about-projects-box").forEach((box) => {
  box.addEventListener("click", () => {
    const thumb = box.querySelector(".about-projects-image");
    projectDialogImage.src = thumb.src;
    projectDialogImage.alt = thumb.alt;
    window.clearTimeout(projectDialogCloseTimer);
    projectDialog.showModal();
    window.requestAnimationFrame(() => projectDialog.classList.add("is-open"));
  });
});

projectDialogClose.addEventListener("click", closeProjectDialog);
projectDialog.addEventListener("click", (event) => {
  if (event.target === projectDialog) closeProjectDialog();
});
projectDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeProjectDialog();
});
projectDialog.addEventListener("close", () => {
  projectDialog.classList.remove("is-open");
});
