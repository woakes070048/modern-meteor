Meteor.publish('estateobjects', function (id) {

    var loggedInUser;

    if (this.userId) {

        loggedInUser = Meteor.users.findOne(this.userId);

        return EstateObjects.find({city_id: loggedInUser.city_id}, {
            'sort': {
                creationDate: 1
            }
        });
    } else {

        this.ready();
        return [];
    }
});

Meteor.publish('estateobjectById', function (id) {

    id = YaFilter.clean({
        source: s(id).trim().value(),
        type: 'AlNum'
    });

    if (this.userId) {

        var loggedInUser;

        loggedInUser = Meteor.users.findOne(this.userId);

        if (Roles.userIsInRole(loggedInUser, ['admin','manager'])) {

            return EstateObjects.find({_id: id, city_id: loggedInUser.city_id}, {

                'sort': {
                    'creationDate': 1
                }
            });
        } else {

            var currClient = Clients.findOne({
                'userAccountId': this.userId
            });

            if (!currClient) {

                var fields = {
                    'price': 1,
                    'street': 1,
                    'houseNumber': 1,
                    'coords': 1,
                    'cityblock_id': 1,
                    'typeofestate_id': 1,
                    'repairtype_id': 1,
                    'uploadedImages': 1,
                    'modifyDate': 1,
                    'creationDate': 1,
                    'desc': 1,
                    'estateobjectStatus': 1
                }
            } else {

                var currSubs = Subscribtions.findOne({
                    'userId': currClient._id,
                    'endDate': {
                        $gte: new Date()
                    }
                });

                if (currSubs) {

                    var fields = {
                        'phone': 1,
                        'price': 1,
                        'street': 1,
                        'houseNumber': 1,
                        'coords': 1,
                        'cityblock_id': 1,
                        'typeofestate_id': 1,
                        'repairtype_id': 1,
                        'uploadedImages': 1,
                        'modifyDate': 1,
                        'creationDate': 1,
                        'desc': 1,
                        'estateobjectStatus': 1
                    }
                } else {

                    var fields = {
                        'price': 1,
                        'street': 1,
                        'houseNumber': 1,
                        'coords': 1,
                        'cityblock_id': 1,
                        'typeofestate_id': 1,
                        'repairtype_id': 1,
                        'uploadedImages': 1,
                        'modifyDate': 1,
                        'creationDate': 1,
                        'desc': 1,
                        'estateobjectStatus': 1
                    }
                }
            }

            return EstateObjects.find({_id: id, city_id: loggedInUser.city_id}, {
                'fields': fields,

                'sort': {
                    'creationDate': 1
                }
            });
        }


    } else {

        var city = Cities.findOne({'cityName': 'Иваново'});

        var city_id = city._id;

        return EstateObjects.find({_id: id, city_id: city_id}, {
            'fields': {
                'price': 1,
                'street': 1,
                'houseNumber': 1,
                'coords': 1,
                'cityblock_id': 1,
                'typeofestate_id': 1,
                'repairtype_id': 1,
                'uploadedImages': 1,
                'modifyDate': 1,
                'creationDate': 1,
                'desc': 1,
                'estateobjectStatus': 1
            },

            'sort': {
                'creationDate': 1
            }
        });
    }
});

Meteor.publish('estateobjectsList', function (findOptions) {

    var loggedInUser,
        limit,
        estateobjectsStatus,
        searchObj,
        query,
        minPrice,
        maxPrice,
        cityblock_id,
        typeofestate_id;

    if (this.userId) {

        loggedInUser = Meteor.users.findOne(this.userId);

        if (Roles.userIsInRole(loggedInUser, ['admin','manager'])) {

            limit = parseInt(findOptions.limit) || 5;


            estateobjectsStatus = findOptions.estateobjectStatus;

            if (estateobjectsStatus !== 'active' && estateobjectsStatus !== 'adv' && estateobjectsStatus !== 'archive' && estateobjectsStatus !== 'call') {

                estateobjectsStatus = 'active';
            }


            searchObj = {
                'estateobjectStatus': estateobjectsStatus,
                'city_id': loggedInUser.city_id
            };


            query = YaFilter.clean({
                'source': s(findOptions.query).trim().value(),
                'type': 'stringUrl'
            }) || '';

            if (query) {

                searchObj.street = {$regex: query, $options: "i"}
            }


            minPrice = YaFilter.clean({

                'source': s(findOptions.minPrice).trim().value(),
                'type': 'int'
            }) || '';

            minPrice = minPrice || 0;

            maxPrice = YaFilter.clean({

                'source': s(findOptions.maxPrice).trim().value(),
                'type': 'int'
            }) || '';

            maxPrice = maxPrice || 0;

            if (minPrice || maxPrice) {

                if (minPrice) {

                    if (maxPrice) {

                        searchObj.price = {$gte: minPrice, $lte: maxPrice};
                    } else {

                        searchObj.price = {$gte: minPrice};
                    }
                } else {
                    searchObj.price = {$lte: maxPrice};
                }
            }

            var cityblock_ids = findOptions.cityblock_id;

            if (!_.isArray(cityblock_ids)) {

                cityblock_ids = [];
            }


             _.each(cityblock_ids, function (element, index, list) {

                var newVal;

                newVal = YaFilter.clean({

                    'source': s(element).trim().value(),
                    'type': 'alNum'
                }) || '';

                cityblock_ids[index] = newVal;
            });


            if (cityblock_ids.length) {

                searchObj.cityblock_id = {
                    $in: cityblock_ids
                };
            }


            var typeofestate_ids = findOptions.typeofestate_id;

            if (!_.isArray(typeofestate_ids)) {

                typeofestate_ids = [];
            }


             _.each(typeofestate_ids, function (element, index, list) {

                var newVal;

                newVal = YaFilter.clean({

                    'source': s(element).trim().value(),
                    'type': 'alNum'
                }) || '';

                typeofestate_ids[index] = newVal;
            });

            if (typeofestate_ids.length) {

                searchObj.typeofestate_id = {
                    $in: typeofestate_ids
                };
            }

            return EstateObjects.find(searchObj, {
                'sort': {
                    'modifyDate': 1,
                    'creationDate': -1
                },
                'limit': limit
            });
        } else {

            this.ready();
            return [];
        }
    } else {

        this.ready();
        return [];
    }
});


Meteor.publish('flatsList', function (findOptions) {

    var loggedInUser,
        limit,
        estateobjectsStatus,
        searchObj,
        query,
        minPrice,
        maxPrice,
        cityblock_id,
        typeofestate_id;


        loggedInUser = Meteor.users.findOne(this.userId);

        if (loggedInUser) {

            var city_id = loggedInUser.city_id;
        } else {

            var city = Cities.findOne({'cityName': 'Иваново'});

            var city_id = city._id;
        }

        if (findOptions.limit == 'all') {

            limit = findOptions.limit;
        } else {

            limit = parseInt(findOptions.limit) || 12;
        }


        estateobjectsStatus = 'active';


        searchObj = {
            'estateobjectStatus': estateobjectsStatus,
            'city_id': city_id
        };


        minPrice = YaFilter.clean({

            'source': s(findOptions.minPrice).trim().value(),
            'type': 'int'
        }) || '';

        minPrice = minPrice || 0;

        maxPrice = YaFilter.clean({

            'source': s(findOptions.maxPrice).trim().value(),
            'type': 'int'
        }) || '';

        maxPrice = maxPrice || 0;

        if (minPrice || maxPrice) {

            if (minPrice) {

                if (maxPrice) {

                    searchObj.price = {$gte: minPrice, $lte: maxPrice};
                } else {

                    searchObj.price = {$gte: minPrice};
                }
            } else {
                searchObj.price = {$lte: maxPrice};
            }
        }

        var cityblock_ids = findOptions.cityblock_id;

        if (!_.isArray(cityblock_ids)) {

            cityblock_ids = [];
        }


         _.each(cityblock_ids, function (element, index, list) {

            var newVal;

            newVal = YaFilter.clean({

                'source': s(element).trim().value(),
                'type': 'alNum'
            }) || '';

            cityblock_ids[index] = newVal;
        });


        if (cityblock_ids.length) {

            searchObj.cityblock_id = {
                $in: cityblock_ids
            };
        }


        var typeofestate_ids = findOptions.typeofestate_id;

        if (!_.isArray(typeofestate_ids)) {

            typeofestate_ids = [];
        }


         _.each(typeofestate_ids, function (element, index, list) {

            var newVal;

            newVal = YaFilter.clean({

                'source': s(element).trim().value(),
                'type': 'alNum'
            }) || '';

            typeofestate_ids[index] = newVal;
        });

        if (typeofestate_ids.length) {

            searchObj.typeofestate_id = {
                $in: typeofestate_ids
            };
        }

        var currClient = null;

        if (this.userId) {

            var currClient = Clients.findOne({
                'userAccountId': this.userId
            });
        }


        if (!currClient) {

            var fields = {
                'price': 1,
                'street': 1,
                'houseNumber': 1,
                'coords': 1,
                'cityblock_id': 1,
                'typeofestate_id': 1,
                'repairtype_id': 1,
                'uploadedImages': 1,
                'modifyDate': 1,
                'creationDate': 1,
                'desc': 1,
                'estateobjectStatus': 1
            }
        } else {

            var currSubs = Subscribtions.findOne({
                'userId': currClient._id,
                'endDate': {
                    $gte: new Date()
                }
            });

            if (currSubs) {

                var fields = {
                    'phone': 1,
                    'price': 1,
                    'street': 1,
                    'houseNumber': 1,
                    'coords': 1,
                    'cityblock_id': 1,
                    'typeofestate_id': 1,
                    'repairtype_id': 1,
                    'uploadedImages': 1,
                    'modifyDate': 1,
                    'creationDate': 1,
                    'estateobjectStatus': 1
                }
            } else {

                var fields = {
                    'price': 1,
                    'street': 1,
                    'houseNumber': 1,
                    'coords': 1,
                    'cityblock_id': 1,
                    'typeofestate_id': 1,
                    'repairtype_id': 1,
                    'uploadedImages': 1,
                    'modifyDate': 1,
                    'creationDate': 1,
                    'estateobjectStatus': 1
                }
            }
        }


        if (limit == 'all') {

            return EstateObjects.find(searchObj, {

                'fields': fields,

                'sort': {
                    'creationDate': -1,
                    'modifyDate': -1,
                }
            });
        } else {

            return EstateObjects.find(searchObj, {

                'fields': fields,

                'sort': {
                    'creationDate': -1,
                    'modifyDate': -1,
                },

                'limit': limit
            });
        }
});

Meteor.publish('lastFlats', function (id) {

    var loggedInUser;

    loggedInUser = Meteor.users.findOne(this.userId);

    if (loggedInUser) {

        var city_id = loggedInUser.city_id;

        var currClient = Clients.findOne({
            'userAccountId': this.userId
        });


        if (!currClient) {

            var fields = {
                'price': 1,
                'street': 1,
                'houseNumber': 1,
                'coords': 1,
                'cityblock_id': 1,
                'typeofestate_id': 1,
                'repairtype_id': 1,
                'uploadedImages': 1,
                'modifyDate': 1,
                'creationDate': 1,
                'desc': 1,
                'estateobjectStatus': 1
            }
        } else {

            var currSubs = Subscribtions.findOne({
                'userId': currClient._id,
                'endDate': {
                    $gte: new Date()
                }
            });

            if (currSubs) {

                var fields = {
                    'phone': 1,
                    'price': 1,
                    'street': 1,
                    'houseNumber': 1,
                    'coords': 1,
                    'cityblock_id': 1,
                    'typeofestate_id': 1,
                    'repairtype_id': 1,
                    'uploadedImages': 1,
                    'modifyDate': 1,
                    'creationDate': 1,
                    'estateobjectStatus': 1
                }
            } else {

                var fields = {
                    'price': 1,
                    'street': 1,
                    'houseNumber': 1,
                    'coords': 1,
                    'cityblock_id': 1,
                    'typeofestate_id': 1,
                    'repairtype_id': 1,
                    'uploadedImages': 1,
                    'modifyDate': 1,
                    'creationDate': 1,
                    'estateobjectStatus': 1
                }
            }
        }
    } else {

        var city = Cities.findOne({'cityName': 'Иваново'});

        var city_id = city._id;

        var fields = {
                'price': 1,
                'street': 1,
                'houseNumber': 1,
                'coords': 1,
                'cityblock_id': 1,
                'typeofestate_id': 1,
                'repairtype_id': 1,
                'uploadedImages': 1,
                'modifyDate': 1,
                'creationDate': 1,
                'estateobjectStatus': 1
            }
    }





    return EstateObjects.find({
        'city_id': city_id,
        'uploadedImages': {
            $ne: []
        },
        'estateobjectStatus': 'active'
    },
    {
        'fields': fields,

        'sort': {
            'creationDate': -1
        },

        'limit': 4
    });
});


Meteor.publish('sameFlats', function (id) {

    id = YaFilter.clean({
        source: s(id).trim().value(),
        type: 'AlNum'
    });

    var loggedInUser;

    loggedInUser = Meteor.users.findOne(this.userId);

    if (loggedInUser) {

        var city_id = loggedInUser.city_id;


        var currClient = Clients.findOne({
            'userAccountId': this.userId
        });


        if (!currClient) {

            var fields = {
                'price': 1,
                'street': 1,
                'houseNumber': 1,
                'coords': 1,
                'cityblock_id': 1,
                'typeofestate_id': 1,
                'repairtype_id': 1,
                'uploadedImages': 1,
                'modifyDate': 1,
                'creationDate': 1,
                'desc': 1,
                'estateobjectStatus': 1
            }
        } else {

            var currSubs = Subscribtions.findOne({
                'userId': currClient._id,
                'endDate': {
                    $gte: new Date()
                }
            });

            if (currSubs) {

                var fields = {
                    'phone': 1,
                    'price': 1,
                    'street': 1,
                    'houseNumber': 1,
                    'coords': 1,
                    'cityblock_id': 1,
                    'typeofestate_id': 1,
                    'repairtype_id': 1,
                    'uploadedImages': 1,
                    'modifyDate': 1,
                    'creationDate': 1,
                    'estateobjectStatus': 1
                }
            } else {

                var fields = {
                    'price': 1,
                    'street': 1,
                    'houseNumber': 1,
                    'coords': 1,
                    'cityblock_id': 1,
                    'typeofestate_id': 1,
                    'repairtype_id': 1,
                    'uploadedImages': 1,
                    'modifyDate': 1,
                    'creationDate': 1,
                    'estateobjectStatus': 1
                }
            }
        }
    } else {

        var city = Cities.findOne({'cityName': 'Иваново'});

        var city_id = city._id;

        var fields = {
                'price': 1,
                'street': 1,
                'houseNumber': 1,
                'coords': 1,
                'cityblock_id': 1,
                'typeofestate_id': 1,
                'repairtype_id': 1,
                'uploadedImages': 1,
                'modifyDate': 1,
                'creationDate': 1,
                'estateobjectStatus': 1
            }
    }


    var currFlat = EstateObjects.findOne(id);


    return EstateObjects.find({
        '_id': {
            $ne: id
        },
        'cityblock_id': currFlat.cityblock_id,
        'typeofestate_id': currFlat.typeofestate_id,
        'estateobjectStatus': 'active'
    },
    {
        'fields': fields,
        'limit': 4
    });
});

Meteor.publish('featuredList', function (findOptions) {

    var loggedInUser,
        limit,
        estateobjectsStatus,
        searchObj,
        query,
        minPrice,
        maxPrice,
        cityblock_id,
        typeofestate_id;


        loggedInUser = Meteor.users.findOne(this.userId);

        if (loggedInUser) {

            var city_id = loggedInUser.city_id;
        } else {

            this.ready();
            return [];
        }

        if (findOptions.limit == 'all') {

            limit = findOptions.limit;
        } else {

            limit = parseInt(findOptions.limit) || 12;
        }


        estateobjectsStatus = 'active';


        searchObj = {
            'estateobjectStatus': estateobjectsStatus,
            'city_id': city_id
        };


        var currClient = null;

        if (this.userId) {

            var currClient = Clients.findOne({
                'userAccountId': this.userId
            });
        }


        if (!currClient) {

            var fields = {
                'price': 1,
                'street': 1,
                'houseNumber': 1,
                'coords': 1,
                'cityblock_id': 1,
                'typeofestate_id': 1,
                'repairtype_id': 1,
                'uploadedImages': 1,
                'modifyDate': 1,
                'creationDate': 1,
                'desc': 1,
                'estateobjectStatus': 1
            }
        } else {

            var currSubs = Subscribtions.findOne({
                'userId': currClient._id,
                'endDate': {
                    $gte: new Date()
                }
            });

            if (currSubs) {

                var fields = {
                    'phone': 1,
                    'price': 1,
                    'street': 1,
                    'houseNumber': 1,
                    'coords': 1,
                    'cityblock_id': 1,
                    'typeofestate_id': 1,
                    'repairtype_id': 1,
                    'uploadedImages': 1,
                    'modifyDate': 1,
                    'creationDate': 1,
                    'estateobjectStatus': 1
                }
            } else {

                var fields = {
                    'price': 1,
                    'street': 1,
                    'houseNumber': 1,
                    'coords': 1,
                    'cityblock_id': 1,
                    'typeofestate_id': 1,
                    'repairtype_id': 1,
                    'uploadedImages': 1,
                    'modifyDate': 1,
                    'creationDate': 1,
                    'estateobjectStatus': 1
                }
            }
        }


        var featuredObjects = Featured.find({
            'userId': this.userId
        }).fetch();

        var featuredObjectsIds = _.pluck(featuredObjects, 'object_id');

        if (featuredObjectsIds.length) {

            searchObj._id = {
                $in: featuredObjectsIds
            }


            if (limit == 'all') {

                return EstateObjects.find(searchObj, {

                    'fields': fields,

                    'sort': {
                        'creationDate': -1,
                        'modifyDate': -1,
                    }
                });
            } else {

                return EstateObjects.find(searchObj, {

                    'fields': fields,

                    'sort': {
                        'creationDate': -1,
                        'modifyDate': -1,
                    },

                    'limit': limit
                });
            }
        } else {

            this.ready();
            return [];
        }
});
