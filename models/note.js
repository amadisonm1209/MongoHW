var mongoose = require("mongoose");

//save a reference
var Schema = mongoose.Schema;

//create a new note object
var NoteSchema = new Schema({
    body: String,
    title: String

});

//create and export model 
var Note = mongoose.model("Note", NoteSchema);
module.exports = Note;

