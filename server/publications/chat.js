Meteor.publish('generalChat', function () {

    if (this.userId) {

        return Chat.find({
            'reciver': 'all'
        }, {

            'fields': {
                'userId': false
            },
            'sort': {
                'creationDate': 1
            }
        });
    } else {

        // User is not authorized
        this.ready();
        return [];
    }
});
