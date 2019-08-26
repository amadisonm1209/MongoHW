var mongoose = require("mongoose");

//Save a reference 
var Schema = mongoose.Schema;

//Using Schema, create a new object
var ArticleSchema = new Schema ({
    title: {
        type: String,
        required: true,
    }, 
    link: {
        type: String,
        required: true,
    }, 
    summary: {
        type: String,
        required: true
    }, 
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }],
    saved: {
        type: Boolean,
        default: false
    }
});

//create and export the model from the schema
var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;