// Cities
Router.map(function () {

    this.route('cities', {

        'path': '/admin/cities',

        'data': function () {

            return {
                'cities': Cities.find()
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

            return Cities.findOne(_id);
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
