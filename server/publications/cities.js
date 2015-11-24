Meteor.publish('cities', function (onlyActive) {

    if (this.userId) {

        if (onlyActive) {

            var searchObj = {
                'isActive': true
            };
        } else {
            
            searchObj = {};
        }

        if (Roles.userIsInRole(this.userId, ['admin'])) {

            return Cities.find(searchObj, {

                'fields': {
                    'cityName': 1,
                    'coordX': 1,
                    'coordY': 1,
                    'creationDate': 1
                },

                'sort': {
                    'cityName': 1,
                    'creationDate': 1
                }
            });
        } else {

            // User does not have permissions
            this.ready();
            return [];
        }
    } else {

        // User is not authorized
        return Cities.find({'isActive': true}, {

            'fields': {

                'cityName': 1
            },

            'sort': {

                'cityName': 1
            }
        });
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
