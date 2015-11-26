Meteor.publish('sources', function () {

    if (this.userId) {

        if (Roles.userIsInRole(this.userId, ['admin'])) {

            return Sources.find({}, {

                'fields': {
                    'sourceName': 1,
                    'creationDate': 1
                },

                'sort': {
                    'sourceName': 1,
                    'creationDate': 1
                }
            });
        } else {

            return Sources.find({'isActive': true}, {

                'fields': {
                    'sourceName': 1
                },
                'sort': {
                    'sourceName': 1
                }
            });
        }
    } else {

        // user not authorized. do not publish secrets
        this.ready();
        return [];
    } 
});

Meteor.publish('sourceById', function (id) {

    if (this.userId) {

        if (Roles.userIsInRole(this.userId, ['admin'])) {

            id = YaFilter.clean({
                source: s(id).trim().value(),
                type: 'AlNum'
            });
            
            return Sources.find({_id: id}, {
                'fields': {

                    'sourceName': 1,

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