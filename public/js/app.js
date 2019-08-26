$(document).ready(function () {
  $('.modal').modal();
})

//GET route for scraping articles
$(document).on("click", "#scrape", function () {
  $(".articles").empty();

  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function (data) {
    console.log(data);
    window.location = "/"
  })

})

//GET route for showing saved articles 
$(".saved-button").on("click", function () {
  //may need to empty something here 

  $.ajax({
    method: "GET",
    url: "/saved"
  }).then(function (data) {
    console.log(data);
  })
})


//on click to save an article to the saved database
$(".save").on("click", function () {

  var articleId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/articles/save/" + articleId
  }).then(function (data) {
    //refresh page
    location.reload();
  })
});

//on click to delete an article to the saved database
$(".delete").on("click", function () {

  var articleId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/articles/delete/" + articleId
  }).then(function (data) {
    //refresh page
    window.location = "/saved"
  })
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {

  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  let note = {};
  note.title = $(".modal-title").val().trim();
  note.body = $("#noteInput" + thisId).val().trim();

  $.ajax({
    method: "POST",
    url: "/notes/" + thisId,
    data: note
  }).done(function () {

    $(".modal").modal("close");
    location.reload();
  });
});

$(document).on("click", ".deleteNote", function () {

  var noteId = $(this).attr("data-note-id");
  var articleId = $(this).attr("data-article-id");

  $.ajax({
    method: "DELETE",
    url: "/notes/" + noteId
  }).done(function (data) {
    $(".modal").modal("close");
    location.reload();
  })
});
