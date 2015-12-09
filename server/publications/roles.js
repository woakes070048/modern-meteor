Meteor.publish('allRoles', function () {

    if (this.userId) {

        var userId = YaFilter.clean({
            source: s(this.userId).trim().value(),
            type: 'AlNum'
        });

        var AclPublish = new AclForPublish(userId);

        var isAllowed = AclPublish.isAllowed(userId, 'roles', ['read']);

        if (isAllowed) {

            var role_ids = AclPublish.getAllRolesIds();

            return AclRoles.find({
                '_id': {
                    $in: role_ids
                }
            });
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
