// Sources
Router.map(function () {

    this.route('sources', {

        'path': '/admin/sources',

        'data': function () {

            return {
                'sources': Sources.find()
            };
        },

        'waitOn': function () {

            return Meteor.subscribe('sources');
        }
    });
});

// Source detail
Router.map(function () {

    this.route('source', {

        'path': '/admin/sources/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Sources.findOne(_id);
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Meteor.subscribe('sourceById', _id);
        }
    });
});

// New source
Router.route('/admin/newsource', {name: 'sourceNew'});
