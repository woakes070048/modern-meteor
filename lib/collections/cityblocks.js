CityBlocks = new Mongo.Collection('cityblocks');

Meteor.methods({

    'cityblockInsert': function (attributes) {

        var loggedInUser,
            city_id,
            city,
            cityName,
            entity,
            entityId;

        
        loggedInUser = YaUtilities.checkUser('admin');


        city_id = YaFilter.clean({
            'source': s(attributes.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({
            _id: city_id
        },
        {
            'fields': {
                'cityName': 1,
            }
        });

        if (!city) {

            // No such city
            throw new Meteor.Error('Error', 'There is no city ' + city_id + ' in database.');
        }

        cityName = city.cityName;


        entity = {

            'cityBlockName': YaFilter.clean({
                'source': s(attributes.cityBlockName).trim().value(),
                'type': 'String'
            }),

            'city_id': city_id,

            'cityName': cityName,

            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            }),

            'userId': loggedInUser._id,

            'author': loggedInUser.fullname,

            'creationDate': new Date()
        };


        check(entity, {
            
            'cityBlockName': String,

            'city_id': String,

            'cityName': String,

            'isActive': Boolean,

            'userId': String,

            'author': String,

            'creationDate': Date
        });


        entityId = CityBlocks.insert(entity);


        return {
          '_id': entityId
        };
    },

    'cityblockUpdate': function (_id, attributes) {
        
        var loggedInUser,
            city_id,
            city,
            cityName,
            entity;


        loggedInUser = YaUtilities.checkUser('admin');
        

        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });


        city_id = YaFilter.clean({
            'source': s(attributes.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({
            _id: city_id
        },
        {
            'fields': {
                'cityName': 1,
            }
        });

        if (!city) {

            // No such city
            throw new Meteor.Error('Error', 'There is no city ' + city_id + ' in database.');
        }

        cityName = city.cityName;


        // Clean _id
        check(_id, String);


        entity = {

            'cityBlockName': YaFilter.clean({
                'source': s(attributes.cityBlockName).trim().value(),
                'type': 'String'
            }),

            'city_id': city_id,

            'cityName': cityName,

            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            })
        };


        // Clean attributes
        check(entity, {

          'cityBlockName': String,

          'city_id': String,

          'cityName': String,

          'isActive': Boolean
        });


        // Update record
        CityBlocks.update({'_id': _id}, {$set: entity}, function (error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', error.reason);
            }
        });

        return 1;
    }
});