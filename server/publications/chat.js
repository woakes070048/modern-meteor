Meteor.publish('generalChat', function () {

    if (this.userId) {

        var userId = YaFilter.clean({
            source: s(this.userId).trim().value(),
            type: 'AlNum'
        });

        var AclPublish = new AclForPublish(userId);

        var isAllowed = AclPublish.isAllowed(userId, 'chat', ['read']);

        if (isAllowed) {

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

    } else {

        // User is not authorized
        this.ready();
        return [];
    }
});
