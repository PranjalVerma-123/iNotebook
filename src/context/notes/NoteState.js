import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:8000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial)
  //Get all notes 
  const GetNotes = async() => {
    //Todo APi call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "Get",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json();
    
    setNotes(json);
  }

  // Add a note 
  const AddNote = async(title, description, tag) => {
    //Todo APi call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },

      body: JSON.stringify({title,description,tag})
    });
    const note = await response.json();
    setNotes(notes.concat(note));
  }
  // Delete a note

  const DeleteNote = async(id) => {
    // Todo APi call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json();
    console.log(json);
    //
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    })
    setNotes(newNotes);
  }
  // Edit a note
  const EditNote = async (id, title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },

      body: JSON.stringify({title,description,tag}),
    });
    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes));
    //Logic to edit the note
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      

    }
    setNotes(newNotes);


  }
  return (

    <NoteContext.Provider value={{  notes, AddNote, DeleteNote, EditNote, GetNotes }}>
      {props.children}
    </NoteContext.Provider>

  )
}

export default NoteState;