EstateObjects = new Mongo.Collection('estateobjects');

Meteor.methods({

    'estateobjectInsert': function (attributes) {

        var loggedInUser,
            city_id,
            city,
            cityName,
            entity,
            dateOfOpening,
            entityId,
            haveErrors = false,
            errors = [];
        

        loggedInUser = YaUtilities.checkUser(['admin', 'manager']);


        city_id = YaFilter.clean({
            'source': s(loggedInUser.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({_id: city_id});

        if (!city) {

           // No such city
            return {
                'status': 'error',
                'result': 'Города с id ' + city_id + ' не существует.'
            }
        }

        cityName = city.cityName;
        

        entity = {

            'owner': YaFilter.clean({
                'source': s(attributes.owner).trim().value(),
                'type': 'String'
            }),

            'phone': YaFilter.clean({
                'source': attributes.phone,
                'type': 'Number'
            }),

            'cityblock_id': YaFilter.clean({
                'source': s(attributes.cityblock_id).trim().value(),
                'type': 'AlNum'
            }),

            'typeofestate_id': YaFilter.clean({
                'source': s(attributes.typeofestate_id).trim().value(),
                'type': 'AlNum'
            }),

            'price': YaFilter.clean({
                'source': attributes.price,
                'type': 'Int'
            }),

            'street': YaFilter.clean({
                'source': s(attributes.street).trim().value(),
                'type': 'String'
            }),

            'houseNumber': YaFilter.clean({
                'source': s(attributes.houseNumber).trim().value(),
                'type': 'String'
            }),

            'repairtype_id': YaFilter.clean({
                'source': s(attributes.repairtype_id).trim().value(),
                'type': 'AlNum'
            }),

            'floor': YaFilter.clean({
                'source': s(attributes.floor).trim().value(),
                'type': 'Int'
            }),

            'floority': YaFilter.clean({
                'source': s(attributes.floority).trim().value(),
                'type': 'Int'
            }),

            'furniture': YaFilter.clean({
                'source': s(attributes.furniture).trim().value(),
                'type': 'Int'
            }),

            'technics': YaFilter.clean({
                'source': s(attributes.technics).trim().value(),
                'type': 'Int'
            }),

            'areaFull': YaFilter.clean({
                'source': s(attributes.areaFull).trim().value(),
                'type': 'Int'
            }),

            'areaLiving': YaFilter.clean({
                'source': s(attributes.areaLiving).trim().value(),
                'type': 'Int'
            }),

            'areaKitchen': YaFilter.clean({
                'source': s(attributes.areaKitchen).trim().value(),
                'type': 'Int'
            }),

            'desc': YaFilter.clean({
                'source': s(attributes.desc).trim().value(),
                'type': 'String'
            }),

            'estateobjectStatus': YaFilter.clean({
                'source': s(attributes.estateobjectStatus).trim().value(),
                'type': 'Word'
            }),

            'source': YaFilter.clean({
                'source': s(attributes.source).trim().value(),
                'type': 'String'
            }),
            
            'isOpening': YaFilter.clean({
                'source': attributes.isOpening,
                'type': 'Boolean'
            }),

            'isPartner': YaFilter.clean({
                'source': attributes.isPartner,
                'type': 'Boolean'
            }),

            'callStatus': YaFilter.clean({
                'source': attributes.callStatus,
                'type': 'Int'
            }),

            'notes': YaFilter.clean({
                'source': s(attributes.notes).trim().value(),
                'type': 'String'
            }),

            'city_id': city_id,

            'cityName': cityName,

            'userId': loggedInUser._id,

            'author': loggedInUser.fullname,

            'modifyDate': new Date(),
        	
        	'creationDate': new Date()
        };


        if (!entity.owner) {

            errors.push('owner');
            haveErrors = true;
        }

        if (!entity.cityblock_id) {

            errors.push('cityblock_id');
            haveErrors = true;
        }

        if (!entity.typeofestate_id) {

            errors.push('typeofestate_id');
            haveErrors = true;
        }
        
        if (!(+entity.price)) {

            errors.push('price');
            haveErrors = true;
        }

        if (!entity.street) {

            errors.push('street');
            haveErrors = true;
        }

        if (!entity.estateobjectStatus) {

            errors.push('estateobjectStatus');
            haveErrors = true;
        }

        if (!entity.source) {

            errors.push('source');
            haveErrors = true;
        }   

        if (!(+entity.phone)) {

            errors.push('phone');
            haveErrors = true;
        }


        if (haveErrors) {

            return {

                'status': 'error',
                'result': errors
            }
        }


        check(entity, {
 
            'owner': String,

            'phone': Number,

            'cityblock_id': String,

            'typeofestate_id': String,

            'price': Number,

            'street': String,

            'houseNumber': String,

            'repairtype_id': String,

            'floor': Number,

            'floority': Number,

            'areaFull': Number,

            'areaLiving': Number,

            'areaKitchen': Number,

            'furniture': Number,

            'technics': Number,

            'desc': String,

            'estateobjectStatus': String,

            'source': String,
            
            'isOpening': Boolean,

            'isPartner': Boolean,

            'callStatus': Number,

            'notes': String,

            'city_id': String,

            'cityName': String,

            'userId': String,

            'author': String,

            'modifyDate': Date,

            'creationDate': Date
        });
    
        
        var uploadedImages = attributes.uploadedImages;

        if (!_.isArray(uploadedImages)) {

            uploadedImages = [];
        }

        

        _.each(uploadedImages, function (element, index) {

            var name = YaFilter.clean({
                'source': s(element.name).trim().value(),
                'type': 'Img'
            });

            var subDirectory = YaFilter.clean({
                'source': s(element.subDirectory).trim().value(),
                'type': 'Cmd'
            });

            uploadedImages[index] = {
                'subDirectory': subDirectory,
                'name': name
            };
        });

        entity.uploadedImages = uploadedImages;


        var coords = attributes.coords;

        if (!_.isArray(coords)) {

            coords = [];
        }

        _.each(coords, function (element, index) {

            coords[index] = YaFilter.clean({
                'source': s(element).trim().value(),
                'type': 'Float'
            });
        });

        entity.coords = coords;


        dateOfOpening = attributes.dateOfOpening;

        if (dateOfOpening) {

            dateOfOpening = new Date(dateOfOpening);
            check(dateOfOpening, Date);
        } else {

            dateOfOpening = '';
        }
        
        entity.dateOfOpening = dateOfOpening;

        // Update record
        entityId = EstateObjects.insert(entity);


        entity = _.extend(entity, {
            '_id': entityId
        });

        if (Meteor.isServer) {
            EventDispatcher.emit('onObjectSave', {
                data: {
                    'isNew': true,
                    'entity': entity
                }
            });
        }


        return {
            'status': 'note',
        	'_id': entityId
        };
    },

    'estateobjectUpdate': function (_id, attributes) {

        var loggedInUser,
            city_id,
            city,
            cityName,
            old_entity,
            entity,
            dateOfOpening,
            haveErrors = false,
            errors = [];
        

        loggedInUser = YaUtilities.checkUser(['admin', 'manager']);
        

        // Clean _id
        check(_id, String);
        
        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });


        city_id = YaFilter.clean({
            'source': s(loggedInUser.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({_id: city_id});

        if (!city) {

           // No such city
            return {
                'status': 'error',
                'result': 'Города с id ' + city_id + ' не существует.'
            }
        }

        cityName = city.cityName;
        

        old_entity = EstateObjects.findOne(_id);

        entity = {

            'owner': YaFilter.clean({
                'source': s(attributes.owner).trim().value(),
                'type': 'String'
            }),

            'phone': YaFilter.clean({
                'source': attributes.phone,
                'type': 'Number'
            }),

            'cityblock_id': YaFilter.clean({
                'source': s(attributes.cityblock_id).trim().value(),
                'type': 'AlNum'
            }),

            'typeofestate_id': YaFilter.clean({
                'source': s(attributes.typeofestate_id).trim().value(),
                'type': 'AlNum'
            }),

            'price': YaFilter.clean({
                'source': attributes.price,
                'type': 'Int'
            }),

            'street': YaFilter.clean({
                'source': s(attributes.street).trim().value(),
                'type': 'String'
            }),

            'houseNumber': YaFilter.clean({
                'source': s(attributes.houseNumber).trim().value(),
                'type': 'String'
            }),

            'repairtype_id': YaFilter.clean({
                'source': s(attributes.repairtype_id).trim().value(),
                'type': 'AlNum'
            }),

            'floor': YaFilter.clean({
                'source': s(attributes.floor).trim().value(),
                'type': 'Int'
            }),

            'floority': YaFilter.clean({
                'source': s(attributes.floority).trim().value(),
                'type': 'Int'
            }),

            'furniture': YaFilter.clean({
                'source': s(attributes.furniture).trim().value(),
                'type': 'Int'
            }),

            'technics': YaFilter.clean({
                'source': s(attributes.technics).trim().value(),
                'type': 'Int'
            }),

            'areaFull': YaFilter.clean({
                'source': s(attributes.areaFull).trim().value(),
                'type': 'Int'
            }),

            'areaLiving': YaFilter.clean({
                'source': s(attributes.areaLiving).trim().value(),
                'type': 'Int'
            }),

            'areaKitchen': YaFilter.clean({
                'source': s(attributes.areaKitchen).trim().value(),
                'type': 'Int'
            }),

            'desc': YaFilter.clean({
                'source': s(attributes.desc).trim().value(),
                'type': 'String'
            }),

            'estateobjectStatus': YaFilter.clean({
                'source': s(attributes.estateobjectStatus).trim().value(),
                'type': 'Word'
            }),

            'source': YaFilter.clean({
                'source': s(attributes.source).trim().value(),
                'type': 'String'
            }),
            
            'isOpening': YaFilter.clean({
                'source': attributes.isOpening,
                'type': 'Boolean'
            }),

            'isPartner': YaFilter.clean({
                'source': attributes.isPartner,
                'type': 'Boolean'
            }),

            'callStatus': YaFilter.clean({
                'source': attributes.callStatus,
                'type': 'Int'
            }),

            'notes': YaFilter.clean({
                'source': s(attributes.notes).trim().value(),
                'type': 'String'
            }),

            'city_id': city_id,

            'cityName': cityName,

            'modifyDate': new Date()
        };


        if (!entity.owner) {

            errors.push('owner');
            haveErrors = true;
        }

        if (!entity.cityblock_id) {

            errors.push('cityblock_id');
            haveErrors = true;
        }

        if (!entity.typeofestate_id) {

            errors.push('typeofestate_id');
            haveErrors = true;
        }
        
        if (!(+entity.price)) {

            errors.push('price');
            haveErrors = true;
        }

        if (!entity.street) {

            errors.push('street');
            haveErrors = true;
        }

        if (!entity.estateobjectStatus) {

            errors.push('estateobjectStatus');
            haveErrors = true;
        }

        if (!entity.source) {

            errors.push('source');
            haveErrors = true;
        }   

        if (!(+entity.phone)) {

            errors.push('phone');
            haveErrors = true;
        }


        if (haveErrors) {

            return {

                'status': 'error',
                'result': errors
            }
        }


        check(entity, {
 
            'owner': String,

            'phone': Number,

            'cityblock_id': String,

            'typeofestate_id': String,

            'price': Number,

            'street': String,

            'houseNumber': String,

            'repairtype_id': String,

            'floor': Number,

            'floority': Number,

            'areaFull': Number,

            'areaLiving': Number,

            'areaKitchen': Number,

            'furniture': Number,

            'technics': Number,

            'desc': String,

            'estateobjectStatus': String,

            'source': String,
            
            'isOpening': Boolean,

            'isPartner': Boolean,

            'callStatus': Number,

            'notes': String,

            'city_id': String,

            'cityName': String,

            'modifyDate': Date
        });
    
        
        var uploadedImages = attributes.uploadedImages;

        if (!_.isArray(uploadedImages)) {

            uploadedImages = [];
        }

        

        _.each(uploadedImages, function (element, index) {

            var name = YaFilter.clean({
                'source': s(element.name).trim().value(),
                'type': 'Img'
            });

            var subDirectory = YaFilter.clean({
                'source': s(element.subDirectory).trim().value(),
                'type': 'Cmd'
            });

            uploadedImages[index] = {
                'subDirectory': subDirectory,
                'name': name
            };
        });

        entity.uploadedImages = uploadedImages;


        var coords = attributes.coords;

        if (!_.isArray(coords)) {

            coords = [];
        }

        _.each(coords, function (element, index) {

            coords[index] = YaFilter.clean({
                'source': s(element).trim().value(),
                'type': 'Float'
            });
        });

        entity.coords = coords;


        dateOfOpening = attributes.dateOfOpening;

        if (dateOfOpening) {

            dateOfOpening = new Date(dateOfOpening);
            check(dateOfOpening, Date);
        } else {

            dateOfOpening = '';
        }
        
        entity.dateOfOpening = dateOfOpening;



        // Update record
        EstateObjects.update({'_id': _id}, {$set: entity}, function (error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', error.reason);
            }

            if (Meteor.isServer) {

                entity = _.extend(entity, {
                    '_id': _id
                });

                EventDispatcher.emit('onObjectSave', {
                    data: {
                        'isNew': false,
                        'entity': entity,
                        'old_entity': old_entity
                    }
                });
            }
        });

        return {
            'status': 'note',
            'result': 1
        };
    },

    'estateobjectArchive': function (_id) {


        var loggedInUser = YaUtilities.checkUser(['admin', 'manager']);
        

        // Clean _id
        check(_id, String);
        
        _id = YaFilter.clean({
            source: s(_id).trim().value(),
            type: 'AlNum'
        });


        // Update record
        EstateObjects.update({_id: _id}, {$set: {estateobjectStatus: 'archive', 'modifyDate': new Date()}}, function(error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', 'Ошибка при сохранении.');
            }

            if (Meteor.isServer) {

                EventDispatcher.emit('onObjectArchive', {
                    data: {
                        '_id': _id
                    }
                });
            }
        });

        
        return {
            'status': 'note',
            'result': 1
        };
    },

    'estateobjectRemove': function (_id) {

        var loggedInUser;


        loggedInUser = YaUtilities.checkUser(['admin', 'manager']);
        

        // Clean _id
        check(_id, String);
        
        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });


        EstateObjects.remove({_id: _id}, function (error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', 'Ошибка при сохранении.');
            }

            if (Meteor.isServer) {

                EventDispatcher.emit('onObjectDelete', {
                    data: {
                        '_id': _id
                    }
                });
            }
        });


        return {
            'status': 'note',
            'result': 1
        };
    },

    'getFlats': function (options) {        

        var loggedInUser,
            city_id,
            city;

        loggedInUser = Meteor.user();

        if (loggedInUser) {

            city_id = loggedInUser.city_id;
        } else {

            city = Cities.findOne({'cityName': 'Ярославль'});

            city_id = city._id;
        }

        var flats = EstateObjects.find(
        {
            'estateobjectStatus': 'active',
            'city_id': city_id
        },
        {
            'fields': {
                'price': 1,
                'street': 1,
                'houseNumber': 1,
                'coords': 1,
                'cityblock_id': 1,
                'typeofestate_id': 1,
                'uploadedImages': 1,
                'modifyDate': 1,
                'creationDate': 1
            },

            'sort': {
                'modifyDate': 1,
                'creationDate': -1
            }
        }).fetch();
        
        //return ['test', 'test2'];
        return flats;
    }
});