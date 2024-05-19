import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { nanoid } from "nanoid";
import './style/style.css'

function App() {
  // Lazily initialize the `notes` state from localStorage
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );

  // Initialize `currentNoteId` state
  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );

  // Save `notes` to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Create a new note
  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  // Update the note's content and move it to the top
  function updateNote(text) {
    setNotes((oldNotes) => {
      const updatedNotes = oldNotes.map((note) =>
        note.id === currentNoteId ? { ...note, body: text } : note
      );

      const updatedNote = updatedNotes.find(
        (note) => note.id === currentNoteId
      );
      
      return [updatedNote, ...updatedNotes.filter((note) => note.id !== currentNoteId)];
    });
  }

  // Delete a note by ID
  function deleteNote(event, noteId) {
    event.stopPropagation();
    
    //Just return old notes execpt the deleted one
    setNotes((oldNotes) => oldNotes.filter((note) => note.id !== noteId));
    if (noteId === currentNoteId) {
      setCurrentNoteId("");
    }
  }

  // Find the currently selected note
  function findCurrentNote() {
    return notes.find((note) => note.id === currentNoteId) || notes[0];
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor
              currentNote={findCurrentNote()}
              updateNote={updateNote}
            />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
