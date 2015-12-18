Meteor.publish('cities', function (onlyActive) {

    if (this.userId) {

        var userId = YaFilter.clean({
            source: s(this.userId).trim().value(),
            type: 'AlNum'
        });
    } else {

        var userId = null;
    }

    var AclPublish = new AclForPublish(userId);

    var isAllowedRead = AclPublish.isAllowed(userId, 'cities', ['read']);
    var isAllowedList = AclPublish.isAllowed(userId, 'cities', ['list']);

    if (isAllowedRead) {

        var allowedFields = AclPublish.allowedFields(userId, 'cities', 'read');

        console.log(allowedFields);

        if (allowedFields && _.isArray(allowedFields)) {

            var fields = {};

            _.each(allowedFields, function (allowedField) {

                allowedField = YaFilter.clean({
                    source: s(allowedField).trim().value(),
                    type: 'AlNum'
                });

                fields[allowedField] = 1;
            });

            return Cities.find({},
            {
                'fields': fields
            });
        } else {

            return Cities.find({});
        }
    } else if (isAllowedList) {

        var allowedFields = AclPublish.allowedFields(userId, 'cities', 'list');

        if (allowedFields && _.isArray(allowedFields)) {

            var fields = {};

            _.each(allowedFields, function (allowedField) {

                allowedField = YaFilter.clean({
                    source: s(allowedField).trim().value(),
                    type: 'AlNum'
                });

                fields[allowedField] = 1;
            });

            return Cities.find({},
            {
                'fields': fields
            });
        } else {

            return Cities.find({});
        }
    } else {

        // User does not have permissions
        this.ready();
        return [];
    }
});

Meteor.publish('cityById', function (id) {

    if (this.userId) {

        if (Roles.userIsInRole(this.userId, ['admin'])) {

            id = YaFilter.clean({
                source: s(id).trim().value(),
                type: 'AlNum'
            });

            return Cities.find({_id: id}, {
                'fields': {

                    'cityName': 1,

                    'phone': 1,

                    'coordX': 1,

                    'coordY': 1,

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

Meteor.publish('citiesByUser', function () {

    var loggedInUser;


    if (this.userId) {

        loggedInUser = Meteor.users.findOne(this.userId);

        return Cities.find({_id: loggedInUser.city_id}, {

            'fields': {
                'cityName': 1,
                'phone': 1,
                'coordX': 1,
                'coordY': 1
            },

            'sort': {
                'cityName': 1
            }
        });
    } else {

        // User is not authorized
        return Cities.find({'cityName': 'Иваново'}, {

            'fields': {
                'cityName': 1,
                'phone': 1,
                'coordX': 1,
                'coordY': 1
            },

            'sort': {
                'cityName': 1
            }
        });
    }
});
