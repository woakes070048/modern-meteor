Meteor.publish('allRoles', function () {

    if (this.userId) {

        var userId = YaFilter.clean({
            source: s(this.userId).trim().value(),
            type: 'AlNum'
        });

        var role_ids = Acl.getAllRolesIds();

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
});
