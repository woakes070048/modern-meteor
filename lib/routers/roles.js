// Roles
Router.map(function () {

    this.route('roles', {

        'path': '/admin/roles',

        'data': function () {

            return {
                'roles': AclRoles.find()
            };
        },

        'waitOn': function () {

            return Meteor.subscribe('allRoles');
        }
    });
});

// Role detail
Router.map(function () {

    this.route('role', {

        'path': '/admin/roles/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                source: s(this.params._id).trim().value(),
                type: 'AlNum'
            });


            return AclRoles.findOne(_id);
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                source: s(this.params._id).trim().value(),
                type: 'AlNum'
            });

            return Meteor.subscribe('roleById', _id);
        }
    });
});

// New role
Router.route('/admin/newrole', {name: 'roleNew'});
