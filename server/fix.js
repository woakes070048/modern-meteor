var newUser = Meteor.users.findOne({username: '79612458985'});

if (!newUser) {
    /*
    var newUserId = Accounts.createUser({
        'username': '79612458985',
        'password': 'R7Lj21kA'
    });

    Roles.addUsersToRoles(newUserId, ['admin']);

    var city = Cities.findOne({
        'cityName': 'Иваново'
    });

    if (city) {

        var city_id = city._id;
    } else {

        var city_id = Cities.insert({
            'cityName': 'Иваново'
        });
    }

    // Update record
    Meteor.users.update({
        '_id': newUserId
    },
    {
        $set: {
            'fullname': 'Яковлев Александр',
            'city_id': city_id
        }
    }, function (error, docs) {

        if (error) {

            // display the error to the user
            throw new Meteor.Error('Error', 'Ошибка при создании пользователя.');
        }
    });
    */
}
