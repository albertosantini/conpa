(function ($, _) {
    "use strict";

    var rawTemplate =
            "<div class=\"alert alert-block <%= type %>\">" +
                "<% if (close) { %>" +
                    "<a class=\"close\" data-dismiss=\"alert\" href=\"#\">×</a>" +
                "<% } %>" +
                "<h4 class=\"alert-heading\"><%= heading %></h4>" +
                "<%= message %>" +
            "</div>",
        template = _.template(rawTemplate),
        $message = $("#message");

    function handleClearMessage() {
        $message.empty();
    }

    function handleErrorMessage(e, header, message) {
        $message.html(template({
            type: "alert-error",
            heading: header,
            message: message,
            close: false
        }));
    }

    $.subscribe("clear.message.conpa", handleClearMessage);
    $.subscribe("error.message.conpa", handleErrorMessage);

}(jQuery, window._));
