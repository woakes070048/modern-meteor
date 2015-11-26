// Typeofestate
Router.map(function () {

    this.route('typeofestates', {

        'path': '/admin/typeofestates',

        'data': function () {

            return {
                'typeofestates': Typeofestates.find()
            };
        },

        'waitOn': function() {

            return Meteor.subscribe('typeofestates');
        }
    });
});

// Typeofestate detail
Router.map(function () {

    this.route('typeofestate', {

        'path': '/admin/typeofestates/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Typeofestates.findOne(_id);
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Meteor.subscribe('typeofestateById', _id);
        }
    });
});

// New typeofestate
Router.route('/admin/typeofestate', {name: 'typeofestateNew'});
