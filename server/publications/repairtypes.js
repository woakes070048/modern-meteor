Meteor.publish('repairtypes', function () {

    if (this.userId) {

        if (Roles.userIsInRole(this.userId, ['admin'])) {

            return Repairtypes.find({}, {

                'fields': {

                    'repairTypeName': 1,

                    'creationDate': 1
                },

                'sort': {
                    'repairTypeName': 1
                }
            });
        } else {

            return Repairtypes.find({'isActive': true}, {

                'fields': {
                    'repairTypeName': 1
                },
                'sort': {
                    'repairTypeName': 1
                }
            });
        }
    } else {

        // user not authorized. do not publish secrets
        return Repairtypes.find({'isActive': true}, {

            'fields': {
                'repairTypeName': 1
            },
            'sort': {
                'repairTypeName': 1
            }
        });
    } 
});

Meteor.publish('repairtypeById', function (id) {

    if (this.userId) {

        if (Roles.userIsInRole(this.userId, ['admin'])) {

            id = YaFilter.clean({
                source: s(id).trim().value(),
                type: 'AlNum'
            });
            
            return Repairtypes.find({_id: id}, {
                'fields': {

                    'repairTypeName': 1,

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