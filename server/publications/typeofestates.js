Meteor.publish('typeofestates', function () {

    if (this.userId) {

        if (Roles.userIsInRole(this.userId, ['admin'])) {

            return Typeofestates.find({}, {

                'fields': {

                    'typeOfEstateName': 1,

                    'creationDate': 1
                },

                'sort': {
                    'typeOfEstateName': 1
                }
            });
        } else {

            return Typeofestates.find({'isActive': true}, {

                'fields': {
                    'typeOfEstateName': 1
                },
                'sort': {
                    'typeOfEstateName': 1
                }
            });
        }
    } else {

        // user not authorized. do not publish secrets
        return Typeofestates.find({'isActive': true}, {

            'fields': {
                'typeOfEstateName': 1
            },
            'sort': {
                'typeOfEstateName': 1
            }
        });
    } 
});

Meteor.publish('typeofestateById', function (id) {

    if (this.userId) {

        if (Roles.userIsInRole(this.userId, ['admin'])) {

            id = YaFilter.clean({
                source: s(id).trim().value(),
                type: 'AlNum'
            });
            
            return Typeofestates.find({_id: id}, {
                'fields': {

                    'typeOfEstateName': 1,

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