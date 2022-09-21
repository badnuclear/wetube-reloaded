const { async } = require("regenerator-runtime");

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll("#newDeleteCommentBtn");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "X";
  span2.dataset.id = id;
  span2.dataset.videoId = videoContainer.dataset.id;
  span2.id = "newDeleteCommentBtn";
  span2.className = "video__comment-delete";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
  const newDeleteCommentBtn = document.querySelector("#newDeleteCommentBtn");
  newDeleteCommentBtn.addEventListener("click", handClick);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};
const handClick = async (event) => {
  const { id, videoId } = event.target.dataset;
  const response = await fetch(`/api/videos/${videoId}/comments/${id}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, videoId }),
  });
  if (response.status === 200) {
    event.target.parentNode.remove();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
if (deleteBtn) {
  deleteBtn.forEach((btn) => btn.addEventListener("click", handClick));
}
