$(document).ready(function () {
    $(".image-pick").each(function () {
        var imagepick = this;
        $("progress", imagepick).val(0);
        $("progress", imagepick).hide();
        $("img", imagepick).hide();
        $("button span", imagepick).text($(imagepick).data("text-pick-new"));
        var showPicked = function (id) {
            $("button span", imagepick).text($(imagepick).data("text-pick-again"));
            $("button", imagepick).prop("disabled", false);
            $("progress", imagepick).val(0);
            $("progress", imagepick).hide();
            $("input[type=hidden]", imagepick).val(id);
            $("img", imagepick).prop("src", "/files/" + id);
            $("img", imagepick).show();
        };
        if ($(imagepick).data("existing")) {
            showPicked($(imagepick).data("existing"));
        }
        $("input[type=file]", imagepick).liteUploader({
            script: "/files/new",
            params: {
                type: $(imagepick).data("type")
            }
        }).on("lu:before", function (e, files) {
            $("button span", imagepick).text("Uploading...");
            $("button", imagepick).prop("disabled", true);
            $("progress", imagepick).show();
        }).on("lu:progress", function (e, percentage) {
            $("progress", imagepick).val(percentage);
        }).on("lu:success", function (e, res) {
            console.log(res);
            showPicked(JSON.parse(res)._id);
        }).on("lu:fail", function (e, xhr) {
            console.error(xhr);
        }).on("lu:errors", function (e, errors) {
            console.error(errors);
        });
        $("form").submit(function () {
            $("input[type=file]", imagepick).prop("name", false);
        });
    });
});
