Template.layout.rendered = function () {

    $(document).scroll(function () {

        if ($(document).scrollTop() > 0) {

            $('#toTopBtn').css({
                'display': 'inline-block'
            });
        } else {

            $('#toTopBtn').css({
                'display': 'none'
            });
        }
    });
};

Template.layout.events({

    'click #toTopBtn': function (e) {

        e.preventDefault();

        $(document).scrollTop(0);
    }
});
