            $(document).ready(function () {
                $.getJSON("article.json", function (data) {
                    $("#gtitle").html(data["title"]);
                    $("#gdate").html(data["date"]);
                });
            });