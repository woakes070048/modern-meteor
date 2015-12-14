Meteor.publish('cityblocks', function () {

    if (this.userId) {

        var userId = YaFilter.clean({
            source: s(this.userId).trim().value(),
            type: 'AlNum'
        });

        var AclPublish = new AclForPublish(userId);

        var isAllowed = AclPublish.isAllowed(userId, 'roles', ['read']);

        if (isAllowed) {

            var role_ids = AclPublish.getAllRolesIds();

            var allowedFields = AclPublish.allowedFields(userId, 'roles');

            if (allowedFields) {

                var fields = {};

                _.each(allowedFields, function (allowedField) {

                    allowedField = YaFilter.clean({
                        source: s(allowedField).trim().value(),
                        type: 'AlNum'
                    });

                    fields[allowedField] = 1;
                });

                return CityBlocks.find({},
                {
                    'fields': fields
                });
            } else {

                return CityBlocks.find({});
            }
        } else {

            // User is not authorized
            this.ready();
            return [];
        }
    } else {

        // User is not authorized
        this.ready();
        return [];
    }
});

Meteor.publish('cityblockById', function (id) {

    if (this.userId) {

        if (Roles.userIsInRole(this.userId, ['admin'])) {

            id = YaFilter.clean({
                source: s(id).trim().value(),
                type: 'AlNum'
            });

            return CityBlocks.find({_id: id}, {

                'fields': {

                        'city_id': 1,
                        'cityBlockName': 1,
                        'creationDate': 1,
                        'isActive': 1
                    }
            });
        } else {

            // User does not have permissions
            this.ready();
            return [];
        }
    } else {

        // User is not authorized
        this.ready();
        return [];
    }
});

Meteor.publish('cityblockByCity', function (id) {

    if (this.userId) {

        if (Roles.userIsInRole(this.userId, ['admin'])) {

            id = YaFilter.clean({
                source: s(id).trim().value(),
                type: 'AlNum'
            });

            return CityBlocks.find({city_id: id}, {

                'fields': {
                    'cityName': 1,
                    'city_id': 1,
                    'cityBlockName': 1,
                    'creationDate': 1,
                    'isActive': 1
                },
                'sort': {
                    'cityBlockName': 1
                }
            });
        } else {

            // User does not have permissions
            this.ready();
            return [];
        }
    } else {

        // User is not authorized
        this.ready();
        return [];
    }
});

Meteor.publish('cityblocksByUser', function () {

    var loggedInUser;


    if (this.userId) {

        loggedInUser = Meteor.users.findOne(this.userId);

        return CityBlocks.find({
            'city_id': loggedInUser.city_id,
            'isActive': true
        }, {

            'fields': {
                'cityBlockName': 1
            },

            'sort': {
                'cityBlockName': 1
            }
        });
    } else {

        var city = Cities.findOne({'cityName': 'Иваново'});

        return CityBlocks.find({
            'city_id': city._id,
            'isActive': true
        }, {

            'fields': {
                'cityBlockName': 1
            },

            'sort': {
                'cityBlockName': 1
            }
        });
    }
});
