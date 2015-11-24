// Cities
Router.map(function () {

    this.route('cities', {

        'path': '/admin/cities',

        'data': function () {

            return {
                'cities': Cities.find(),
                'adminLayout': true
            };
        },

        'waitOn': function () {

            return Meteor.subscribe('cities');
        }
    });
});

// City detail
Router.map(function () {

    this.route('city', {

        'path': '/admin/cities/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                source: s(this.params._id).trim().value(),
                type: 'AlNum'
            });


            return {
                'city': Cities.findOne(_id),
                'adminLayout': true
            };
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                source: s(this.params._id).trim().value(),
                type: 'AlNum'
            });

            return Meteor.subscribe('cityById', _id);
        }
    });
});

// New city
Router.route('/admin/newcity', {name: 'cityNew'});
