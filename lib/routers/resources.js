RolesController = RouteController.extend({

    'resource': 'roles'
});
// resources
Router.map(function () {

    this.route('resources', {

        'path': '/admin/resources',

        'data': function () {

            return {
                'resources': Resources.find()
            };
        },

        'waitOn': function () {

            return Meteor.subscribe('allResources');
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'roles'
        })
    });
});

// resource detail
Router.map(function () {

    this.route('resource', {

        'path': '/admin/resources/:_id',

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

            return Meteor.subscribe('resourceById', _id);
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'roles'
        })
    });
});

// New resource
Router.map(function () {

    this.route('resourceNew', {

        'path': '/admin/newresource',

        'controller': RouteController.extend({
            'neededPermitions': ['create'],
            'resource': 'roles'
        })
    });
});
