let uploadedFiles = [];

function handleUpload() {
  const input = document.getElementById("fileInput");
  const previewArea = document.getElementById("previewArea");

  // Add new files to the list
  for (let i = 0; i < input.files.length; i++) {
    uploadedFiles.push(input.files[i]);
  }

  // Clear the current list to avoid duplicates
  previewArea.innerHTML = "";

  // Show updated file list
  uploadedFiles.forEach((file, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>📄 ${file.name}</span>
      <button class="delete-btn" onclick="deleteFile(${index})">×</button>
    `;
    previewArea.appendChild(li);
  });

  // Clear input value so you can upload same file again if needed
  input.value = "";
}

function deleteFile(index) {
  uploadedFiles.splice(index, 1);
  handleUpload(); // Re-render list after deletion
}
