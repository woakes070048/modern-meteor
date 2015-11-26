Template.estateobjects.helpers({

    'isActive': function () {
        
        if (this.formAction === 'estateobjects') {
            
            return 'selected';
        }
    },

    'isAdv': function () {
        
        if (this.formAction === 'estateobjectsadv') {
            
            return 'selected';
        }
    },

    'isCall': function () {
        
        if (this.formAction === 'estateobjectscall') {
            
            return 'selected';
        }
    },

    'isArchive': function () {
        
        if (this.formAction === 'estateobjectsarchive') {
            
            return 'selected';
        }
    },

    'cityblocks': function () {

        var loggedInUser,
            cityblocks,
            that;


        that = this;


        loggedInUser = Meteor.user();


        cityblocks = CityBlocks.find().fetch();

        _.each(cityblocks, function (value) {

            if (_.indexOf(that.cityblock_id, value._id) != -1) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });

        return cityblocks;
    },

    'typeofestates': function () {

        var typeofestates,
            that;


        that = this;


        typeofestates = Typeofestates.find().fetch();

        _.each(typeofestates, function (value) {

            if (_.indexOf(that.typeofestate_id, value._id) != -1) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });

        return typeofestates;
    }
});

Template.estateobjects.rendered = function() {
    
    $('#cityblock_id').select2({
        placeholder: 'Район города'
    });

    $('#typeofestate_id').select2({
        placeholder: 'Тип недвижимости'
    });
};

Template.estateobjects.events({

    'change #by-status': function (e) {

        var entityId;

        e.preventDefault();

        entityId = $.trim(YaRequest.getAlnum('by-status', '', 'INPUT'));

        if (entityId === 'adv') {

            Router.go('estateobjectsadv');
        } else if (entityId === 'archive') {

            Router.go('estateobjectsarchive');
        } else if (entityId === 'call') {

            Router.go('estateobjectscall');
        } else if (entityId === 'active') {

            Router.go('estateobjects');
        }
    },

    'click .archiveBtn': function (e) {

        var id;

        e.preventDefault();

        id = $(e.target).data('id');

        id = YaFilter.clean({
            'source': s(id).trim().value(),
            'type': 'AlNum'
        });
        
        Meteor.call('estateobjectArchive', id, function (error) {

            if (error) {

                // display the error to the user
                alert(error.reason);
            } else {

                alert('Объект архивирован');
            }
        });
    }
});