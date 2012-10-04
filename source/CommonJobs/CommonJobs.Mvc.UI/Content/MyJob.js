/// <reference path="../Scripts/jquery-1.7.2-vsdoc.js" />
$(function () {
    window.postBase = function (id, value) {
        $.ajax({
            url: "/MyJob/Post/" + id,
            type: "POST",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(value)
        });
    };

    
    window.post = function (id, document, others) {
        //TODO: document is a string to avoid issues on binding parameters, it could be fixed in a future
        window.postBase(id, $.extend({}, others, { dynamic: JSON.stringify(document) }));
    }

    window.get = function (id) {
        $.ajax({
            url: "/MyJob/Get/" + id,
            dataType: "json",
            success: function(data) {
                console.debug(data);
            }
        });
    }

    alert("Post a dynamic document...");
    post("employees/276", { dato1: "hola2", dato2: 5, dato3: { a: "a", b: "b", c: 5 }, dato4: [1, 2, 3, 4, "a", {}] });
    alert("Posting, wait few seconds. And then, get a dynamic document...");
    get("employees/276")
    alert("Done!");

});