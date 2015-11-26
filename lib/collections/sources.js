Sources = new Mongo.Collection('sources');

Meteor.methods({

    'sourceInsert': function (attributes) {
        
        check(Meteor.userId(), String);

        var loggedInUser = Meteor.user();

        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
            
            throw new Meteor.Error(403, "Access denied");
        }
        

        check(attributes, {
          sourceName: String,
          isActive: Boolean
        });


        var entity = _.extend({
            sourceName: YaFilter.clean({
                source: s(attributes.sourceName).trim().value(),
                type: 'String'
            }),
            isActive: YaFilter.clean({
                source: attributes.isActive,
                type: 'Boolean'
            })
        }, {
            'userId': loggedInUser._id,

            'author': loggedInUser.fullname,

            'creationDate': new Date()
        });

        var entityId = Sources.insert(entity);

        return {
          _id: entityId
        };
    },

    'sourceUpdate': function (_id, attributes) {
        

        check(Meteor.userId(), String);

        var loggedInUser = Meteor.user();

        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
            
            throw new Meteor.Error(403, "Access denied");
        }
        

        // Clean _id
        check(_id, String);

        _id = YaFilter.clean({
            source: s(_id).trim().value(),
            type: 'AlNum'
        });


        // Clean attributes
        check(attributes, {
          sourceName: String,
          isActive: Boolean
        });

        var entity = _.extend({
            sourceName: YaFilter.clean({
                source: s(attributes.sourceName).trim().value(),
                type: 'String'
            }),
            isActive: YaFilter.clean({
                source: attributes.isActive,
                type: 'Boolean'
            })
        }, {
            
        });

        // Update record
        Sources.update({_id: _id}, {$set: entity}, function(error, docs) {
            if (error) {
            // display the error to the user
                throw new Meteor.Error('Error', error.reason);
            }
        });

        return 1;
    }
});