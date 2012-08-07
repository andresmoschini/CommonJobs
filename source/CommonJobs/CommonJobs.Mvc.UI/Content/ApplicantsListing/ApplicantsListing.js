/// <reference path="../../Scripts/underscore.js" />
$(function () {
    $(".mainSearch").bind('drop dragover', function (e) {
        e.preventDefault();
    });

    $('#fileupload').fileupload({
        //no envía el nombre de archivo en IE
        dataType: 'json',
        //singleFileUploads: false, //si no se pone esta linea se agrega un add por cada archivo
        dropZone: $(".mainSearch"),
        dragover: function (e, f) {
            if (_.any(e.dataTransfer.types, function (x) { return x == "Files" })) {
                console.debug("arrastrando un archivo");
            }
        },
        /*
        add: function (e, data) {
            var files = _.map(data.files, function (file) { return file.name; });
            if (files.length > 0 && confirm("Upload files " + files.join(", ") + "?")) {
                data.submit();
            }
        },
        */
        done: function (e, data) {
            //console.debug(data.result);
        }
    });

    var qs = new QuickSearchPage({
        //pageSize: 3,
        generateRedirectUrl: function (searchParameters) {
            return urlGenerator.action("Index", "Applicants", searchParameters);
        },
        generateSearchUrl: function (searchParameters) {
            return urlGenerator.action("List", "Applicants", searchParameters);
        },
        fillOtherSearchParameters: function (searchParameters) {
            if ($("#HighlightedCheck").prop("checked"))
                searchParameters.Highlighted = true;
            if ($("#HaveInterviewCheck").prop("checked"))
                searchParameters.HaveInterview = true;
            if ($("#HaveTechnicalInterviewCheck").prop("checked"))
                searchParameters.HaveTechnicalInterview = true;
            if ($("#SearchInAttachmentsCheck").prop("checked"))
                searchParameters.SearchInAttachments = true;
        }
    });

    $("#HighlightedCheck, #HaveInterviewCheck, #HaveTechnicalInterviewCheck, #SearchInAttachmentsCheck").change(function () {
        qs.search();
    });

    $("#quickSearchSubmit").click(function () {
        //It also catch "enter"s in form inputs
        qs.redirect();
    });

    $(".results").on("click", ".clickable", function (e) {
        e.preventDefault();
        window.location = $(this).find(".clickable-link").attr("href");
    });

    qs.search();
});
