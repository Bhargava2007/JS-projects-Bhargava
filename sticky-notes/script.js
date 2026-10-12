
let notes = [];

let form = document.getElementById("note-form");
let input = document.getElementById("note-input");
let container = document.getElementById("notes");

// Load saved notes
let savedNotes = localStorage.getItem("notes");

if (savedNotes !== null) {
  notes = JSON.parse(savedNotes);
}

// Save notes
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Display notes
function showNotes() {
  container.innerHTML = "";

  if (notes.length === 0) {
    let message = document.createElement("p");
    message.textContent = "No notes yet. Add your first note!";
    container.appendChild(message);
  }

  for (let i = 0; i < notes.length; i++) {
    let card = document.createElement("div");
    card.className = "note";

    let text = document.createElement("p");
    text.textContent = notes[i];

    let editButton = document.createElement("button");
    editButton.textContent = "Edit";

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";

    // Edit note
    editButton.addEventListener("click", function() {
      let newText = prompt("Edit your note:", notes[i]);

      if (newText !== null && newText.trim() !== "") {
        notes[i] = newText.trim().slice(0, 1000);
        saveNotes();
        showNotes();
      }
    });

    // Delete note
    deleteButton.addEventListener("click", function() {
      notes.splice(i, 1);
      saveNotes();
      showNotes();
    });

    card.appendChild(text);
    card.appendChild(editButton);
    card.appendChild(deleteButton);

    container.appendChild(card);
  }
}

// Add note
form.addEventListener("submit", function(event) {
  event.preventDefault();

  let newNote = input.value.trim();

  if (newNote !== "") {
    notes.push(newNote);

    saveNotes();
    showNotes();

    input.value = "";
  }
});

// Display notes when page opens
showNotes();
