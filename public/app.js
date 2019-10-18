$.getJSON("/articles", function (data) {

    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />s" + data[i].summary + "<br />" + "https://www.nhl.com" + data[i].url + "</p>");
    }
});

$(document).on("click", "p", function () {
    console.log("YES1")
    $("#comments").empty();
    var thisID = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisID
    })

        .then(function (data) {
            console.log(data);
            $("#comments").append("<h2>" + data.title + "<h2>");
            $("#comments").append("<input id='titleinput' name='title' >");
            $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

            if (data.comment) {
                $("#titleinput").val(data.comment.title);
                $("#bodyinput").val(data.comment.title);
            }
        });
});

$(document).on("click", "#savecomment", function () {
    var thisID = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisID,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
            $("#comments").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");

});