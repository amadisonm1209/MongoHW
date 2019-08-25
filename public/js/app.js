$(document).ready(function(){
 
    $('.modal').modal();
 
  })
 
//GET route for scraping articles
$("#scrape").on("click", function (){
    $(".articles").empty();

    $.ajax({
        method: "GET",
        url: "/scrape"
      }).then(function(data){
          console.log(data);

      })

})

//GET route for showing saved articles 
$(".saved-button").on("click", function (){
  //may need to empty something here 

  $.ajax({
      method: "GET",
      url: "/saved"
    }).then(function(data){
        console.log(data);
    })
})


//on click to save an article to the saved database
$(".save").on("click", function() {
  
  var articleId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/articles/save/" + articleId
  }).then(function (data){
    //refresh page
    window.location = "/"

  })
});

//on click to delete an article to the saved database
$(".delete").on("click", function() {
  
  var articleId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/articles/delete/" + articleId
  }).then(function (data){
    //refresh page
    window.location = "/saved"
  })
});

// When you click the savenote button
$("#savenote").on("click",  function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#noteInput" + thisId).val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#noteInput").val("");
      $(".modal").modal("hide");
      window.location = "/saved"
    });
});

$(".deleteNote").on("click", function() {

  var noteId = $(this).attr("data-note-id");
  var articleId = $(this).attr("data-article-id");

  $.ajax({
      method: "DELETE",
      url: "/notes/" + noteId + "/" + articleId
  }).done(function(data) {
      console.log(data)
      $(".modal").modal("hide");
      window.location = "/saved"
  })
});