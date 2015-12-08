Meteor.methods({

    'roleInsert': function (attributes) {

        var loggedInUser,
            entity,
            entityId;


        loggedInUser = YaUtilities.checkUser('admin');

        roleName = YaFilter.clean({
            'source': s(attributes.cityName).trim().value(),
            'type': 'Word'
        });

        entityId = Acl.addRole(roleName);

        return {
            _id: entityId
        };
    }
});
