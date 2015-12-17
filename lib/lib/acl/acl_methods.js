Meteor.methods({

    'roleInsert': function (attributes) {

        var entityId;

        var roleName = YaFilter.clean({
            'source': s(attributes.roleName).trim().value(),
            'type': 'Word'
        });

        entityId = Acl.addRole(roleName);

        return {
            _id: entityId
        };
    },

    'roleRemove': function (roleName) {

        var entityId;

        roleName = YaFilter.clean({
            'source': s(roleName).trim().value(),
            'type': 'Word'
        });

        Acl.removeRole(roleName);

        return {
            'status': 'note',
            'message': 'Роль удалена'
        };
    },

    'resourceInsert': function (attributes) {

        var entityId;

        var resourceName = YaFilter.clean({
            'source': s(attributes.resourceName).trim().value(),
            'type': 'Word'
        });

        entityId = Acl.addResouce(resourceName);

        return {
            _id: entityId
        };
    },

    'resourceRemove': function (resourceName) {

        var entityId;

        resourceName = YaFilter.clean({
            'source': s(resourceName).trim().value(),
            'type': 'Word'
        });

        Acl.removeResource(resourceName);

        return {
            'status': 'note',
            'message': 'Ресурс удален'
        };
    }
});
