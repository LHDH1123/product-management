const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, 2000);
}

const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadPreviewInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  uploadPreviewInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
