Cities = new Mongo.Collection('cities');

Meteor.methods({

    'cityInsert': function (attributes) {

        var loggedInUser,
            entity,
            entityId;


        loggedInUser = YaUtilities.checkUser('admin');


        entity = {

            'cityName': YaFilter.clean({
                'source': s(attributes.cityName).trim().value(),
                'type': 'String'
            }),

            'phone': YaFilter.clean({
                'source': s(attributes.phone).trim().value(),
                'type': 'Number'
            }),

            'coordX': YaFilter.clean({
                'source': s(attributes.coordX).trim().value(),
                'type': 'Float'
            }),

            'coordY': YaFilter.clean({
                'source': s(attributes.coordY).trim().value(),
                'type': 'Float'
            }),

            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            }),

            'userId': loggedInUser._id,

            'author': loggedInUser.fullname,

            'creationDate': new Date()
        };




        check(entity, {

            'cityName': String,

            'phone': Number,

            'coordX': Number,

            'coordY': Number,

            'isActive': Boolean,

            'userId': String,

            'author': String,

            'creationDate': Date
        });

        entityId = Cities.insert(entity);

        if (Meteor.isServer) {
            EventDispatcher.emit('onCitySave', {
                data: {
                    'isNew': true,
                    'city': entity
                }
            });
        }

        return {
            _id: entityId
        };
    },

    'cityUpdate': function (_id, attributes) {

        var loggedInUser,
            entity;


    	loggedInUser = YaUtilities.checkUser('admin');


    	_id = YaFilter.clean({
    		'source': s(_id).trim().value(),
    		'type': 'AlNum'
    	});


    	entity = {

    		'cityName': YaFilter.clean({
        		'source': s(attributes.cityName).trim().value(),
        		'type': 'String'
        	}),

            'phone': YaFilter.clean({
                'source': s(attributes.phone).trim().value(),
                'type': 'Number'
            }),

            'coordX': YaFilter.clean({
                'source': s(attributes.coordX).trim().value(),
                'type': 'Float'
            }),

            'coordY': YaFilter.clean({
                'source': s(attributes.coordY).trim().value(),
                'type': 'Float'
            }),

          	'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            }),
        };


    	check(_id, String);

    	check(entity, {

            'cityName': String,

            'phone': Number,

            'coordX': Number,

            'coordY': Number,

            'isActive': Boolean
        });

        console.log(entity);
    	Cities.update({
    		'_id': _id
    	},
    	{
    		$set: entity
    	},
    	function (error, docs) {

     		if (error) {

                // display the error to the user
            	throw new Meteor.Error('Error', error.reason);
          	}

            var cities = Cities.find().fetch();
            console.log(cities);

            if (Meteor.isServer) {

                EventDispatcher.emit('onCitySave', {
                    data: {
                        'isNew': false,
                        'city': entity
                    }
                });
            }
      	});

      	return 1;
    }
});
