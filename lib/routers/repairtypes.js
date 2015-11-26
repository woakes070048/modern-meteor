// Repairtypes
Router.map(function () {

    this.route('repairtypes', {

        'path': '/admin/repairtypes',

        'data': function () {

            return {
                'repairtypes': Repairtypes.find()
            };
        },

        'waitOn': function () {

            return Meteor.subscribe('repairtypes');
        }
    });
});

// Repairtype detail
Router.map(function () {

    this.route('repairtype', {

        'path': '/admin/repairtypes/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Repairtypes.findOne(_id);
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Meteor.subscribe('repairtypeById', _id);
        }
    });
});

// New repairtype
Router.route('/admin/newrepairtype', {name: 'repairtypeNew'});
