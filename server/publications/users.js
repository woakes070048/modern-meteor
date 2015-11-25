Meteor.publish(null, function() {

    if (this.userId) {

            return Meteor.users.find({_id: this.userId}, {

                'fields': {
                    'fullname': 1,
                    'city_id': 1,
                    'cityName': 1
                }
            });
    } else {

        this.ready();
        return [];
    }
});
