/*
** Estateobjects router
*/

// Estateobjects controller
var CreateClientController = function (options) {

    var template,
        template1,
        increment,
        estateobjectsStatus, // 'active', 'adv', 'archive'
        clientsUrl; // '/clients/', '/clientsadv/', '/clientsarchive/'

    options = options || {};

    increment = options.increment || 5;
    estateobjectsStatus = options.estateobjectsStatus || 'active';

    // Clear client status string
    if (estateobjectsStatus !== 'active' && estateobjectsStatus !== 'adv' && estateobjectsStatus !== 'archive' && estateobjectsStatus !== 'call') {

        estateobjectsStatus = 'active';
    }

    template = 'estateobjects';

    if (estateobjectsStatus === 'adv' || estateobjectsStatus === 'archive' || estateobjectsStatus === 'call') {

        template = template + estateobjectsStatus;
    }

    template1 = template;

    clientsUrl = '/' + template + '/';



    template = 'estateobjects';

    return RouteController.extend({

        'template': template,

        'increment': increment,

        'limit': function () {

            return parseInt(this.params.estateobjectsLimit) || this.increment;
        },

        'findOptions': function () {

            return {

                'limit': this.limit(),
                'query': this.query(),
                'estateobjectStatus': estateobjectsStatus,
                'minPrice': this.minPrice(),
                'maxPrice': this.maxPrice(),
                'cityblock_id': this.cityblock_id(),
                'typeofestate_id': this.typeofestate_id()
            };
        },

        'query': function () {

            return YaFilter.clean({

                'source': s(this.params.query.search).trim().value(),
                'type': 'stringUrl'
            }) || '';
        },

        'minPrice': function () {

            return YaFilter.clean({

                'source': s(this.params.query.minPrice).trim().value(),
                'type': 'int'
            }) || '';
        },

        'maxPrice': function () {

            return YaFilter.clean({

                'source': s(this.params.query.maxPrice).trim().value(),
                'type': 'int'
            }) || '';
        },

        'cityblock_id': function () {

            var cityblock_id = this.params.query.cityblock_id;


            if (!_.isArray(this.params.query.cityblock_id)) {

                cityblock_id = [];
            }


            _.each(cityblock_id, function (element, index, list) {

                var newVal;

                newVal = YaFilter.clean({

                    'source': s(element).trim().value(),
                    'type': 'alNum'
                }) || '';

                cityblock_id[index] = newVal;
            });

            return cityblock_id;
        },

        'typeofestate_id': function () {

            var typeofestate_id = this.params.query.typeofestate_id;


            if (!_.isArray(this.params.query.typeofestate_id)) {

                typeofestate_id = [];
            }


            _.each(typeofestate_id, function (element, index, list) {

                var newVal;

                newVal = YaFilter.clean({

                    'source': s(element).trim().value(),
                    'type': 'alNum'
                }) || '';

                typeofestate_id[index] = newVal;
            });

            return typeofestate_id;
        },

        'subscriptions': function () {

            return [
                Meteor.subscribe('citiesByUser'),
                Meteor.subscribe('cityblocksByUser'),
                Meteor.subscribe('typeofestates'),
                Meteor.subscribe('repairtypes'),
                Meteor.subscribe('estateobjectsList', this.findOptions())
            ];
        },

        'estateobjects': function () {

            return EstateObjects.find();
        },

        'action': function () {

            if (this.ready()) {

                this.render();
            } else {

              this.render('loadingDown', {to: 'load'});
            }
        },

        'data': function () {

            var urlLimit,
                hasMore,
                nextPath,
                query,
                searchQuery,
                searchQuerySet;

            query = this.query();

            // Create backlink url for detail page
            urlLimit = (this.limit() === this.increment) ? '' : this.limit();

            searchQuery = '';

            if (this.query()) {
                searchQuery = 'search=' + this.query();
            }

            if (this.minPrice()) {

                if (searchQuery) {

                    searchQuery = searchQuery + '&minPrice=' + this.minPrice();
                } else {
                    searchQuery = 'minPrice=' + this.minPrice();
                }
            }

            if (this.maxPrice()) {

                if (searchQuery) {

                    searchQuery = searchQuery + '&maxPrice=' + this.maxPrice();
                } else {
                    searchQuery = 'maxPrice=' + this.maxPrice();
                }
            }

            if (this.cityblock_id().length) {

                if (searchQuery) {

                    _.each(this.cityblock_id(), function (element) {

                        searchQuery = searchQuery + '&cityblock_id[]=' + element;
                    });

                } else {

                    _.each(this.cityblock_id(), function (element, index) {

                        if (index === 0) {

                            searchQuery = 'cityblock_id[]=' + element;
                        } else {

                            searchQuery = searchQuery + '&cityblock_id[]=' + element;
                        }
                    });
                }
            }

            if (this.typeofestate_id().length) {

                if (searchQuery) {

                    _.each(this.typeofestate_id(), function (element) {

                        searchQuery = searchQuery + '&typeofestate_id[]=' + element;
                    });
                } else {

                    _.each(this.typeofestate_id(), function (element, index) {

                        if (index === 0) {

                            searchQuery = 'typeofestate_id[]=' + element;
                        } else {

                            searchQuery = searchQuery + '&typeofestate_id[]=' + element;
                        }
                    });
                }
            }

            searchQuerySet = '';

            if (searchQuery) {

                searchQuerySet = '?' + searchQuery;
            }

            // Set backlink url for detail page in session
            Session.set('clientsUrl', clientsUrl + urlLimit + searchQuerySet);

            // Load more link flag
            hasMore = this.estateobjects().fetch().length === this.limit();


            if (searchQuery) {

                nextPath = this.route.path({estateobjectsLimit: this.limit() + this.increment}, {query: searchQuery});
            } else {

                nextPath = this.route.path({estateobjectsLimit: this.limit() + this.increment});
            }


            return {
                'estateobjects': this.estateobjects(),
                'cities': Cities.find({isActive: true}),
                'nextPath': hasMore ? nextPath : null,
                'formAction': template1,
                'query': this.query(),
                'minPrice': this.minPrice(),
                'maxPrice': this.maxPrice(),
                'cityblock_id': this.cityblock_id(),
                'typeofestate_id': this.typeofestate_id()
            };
        }
    });
}


// Estateobject detail page
Router.map(function () {

    this.route('estateobject', {

        'path': '/admin/estateobject/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return EstateObjects.findOne(_id);
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return [
                Meteor.subscribe('citiesByUser'),
                Meteor.subscribe('cityblocksByUser'),
                Meteor.subscribe('repairtypes'),
                Meteor.subscribe('sources'),
                Meteor.subscribe('typeofestates'),
                Meteor.subscribe('estateobjectById', _id)
            ];
        }
    });
});

// New estateobject creation
Router.map(function () {

    this.route('estateobjectNew', {

        'path': '/admin/newestateobject',

        'waitOn': function () {

            return [
                Meteor.subscribe('citiesByUser'),
                Meteor.subscribe('cityblocksByUser'),
                Meteor.subscribe('repairtypes'),
                Meteor.subscribe('sources'),
                Meteor.subscribe('typeofestates')
            ];
        },

        'data': function() {

            var phone;


            phone = YaFilter.clean({

                'source': s(this.params.query.phone).trim().value(),
                'type': 'Number'
            }) || '';


            return {
                'phone': phone
            };
        }
    });
});


// Active estateobjects list
Router.map(function () {

    this.route('estateobjects', {

        'path': '/admin/estateobjects/:estateobjectsLimit?',

        'controller': CreateClientController()
    });
});


// Adv estateobjects list
Router.map(function () {

    this.route('estateobjectsadv', {

        'path': '/admin/estateobjectsadv/:estateobjectsLimit?',

        'controller': CreateClientController({
            'estateobjectsStatus': 'adv'
        })
    });
});


// Archive estateobjects list
Router.map(function () {

    this.route('estateobjectsarchive', {

        'path': '/admin/estateobjectsarchive/:estateobjectsLimit?',

        'controller': CreateClientController({
            'estateobjectsStatus': 'archive'
        })
    });
});

// Call estateobjects list
Router.map(function () {

    this.route('estateobjectscall', {

        'path': '/admin/estateobjectscall/:estateobjectsLimit?',

        'controller': CreateClientController({
            'estateobjectsStatus': 'call'
        })
    });
});
