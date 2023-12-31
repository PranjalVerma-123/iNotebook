const express = require('express');
const router = express.Router();
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');

// Route 1: Get all the notes using GET: "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {


        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// Route 2: Post a new note using Post: "/api/notes/addnote"
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid Title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 character').isLength({ min: 5 }),], async (req, res) => {
        try {
            const { title, description, tag } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()

            res.json(savedNote)
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error!");
        }
    })

// Route 3: Update a exsisting note using Update: "/api/notes/updatenote"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const newNote = {}
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found!"); }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });


    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// Route 4: Delete a exsisting note using Delete: "/api/notes/deletenote"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //Find the note to be delete 
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found!"); }
        //Allow user to delete if user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        //Delete it
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success" : "Note has been deleted", note : note});


    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }
})


module.exports = router