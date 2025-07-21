// PDF Upload and Text Extraction
document.getElementById("extract-btn").addEventListener("click", async () => {
  const fileInput = document.getElementById("pdf-upload");
  const output = document.getElementById("pdf-text-output");

  if (fileInput.files.length === 0) {
    alert("Please select a PDF file first.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function () {
    const typedarray = new Uint8Array(this.result);

    const pdf = await pdfjsLib.getDocument(typedarray).promise;
    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      extractedText += `Page ${i}: \n${pageText}\n\n`;
    }

    output.textContent = extractedText;
  };

  reader.readAsArrayBuffer(file);
});

// To-Do List Functionality
// To-Do List Functionality
const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("add-todo-btn");
const todoList = document.getElementById("todo-list");

addTodoBtn.addEventListener("click", () => {
  const taskText = todoInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const listItem = document.createElement("li");

  // Create checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("todo-checkbox");

  // Create task text span
  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;
  taskSpan.style.marginLeft = "8px";

  // Strike-through on check
  checkbox.addEventListener("change", () => {
    taskSpan.style.textDecoration = checkbox.checked ? "line-through" : "none";
  });

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.onclick = () => listItem.remove();

  // Append all to listItem
  listItem.appendChild(checkbox);
  listItem.appendChild(taskSpan);
  listItem.appendChild(deleteBtn);

  // Add listItem to the DOM
  todoList.appendChild(listItem);
  todoInput.value = "";
});
