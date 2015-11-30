Permitions = new Mongo.Collection('permitions');
AclRoles = new Mongo.Collection('aclroles');
Resources = new Mongo.Collection('resources');
RolesPermitions = new Mongo.Collection('rolespermitions');
UsersRoles = new Mongo.Collection('usersroles');

var YaAcl = function () {

};

YaAcl.prototype.addUserRoles = function (userId, role /* String or Array */) {

    var that = this;

    userId = this.clearUserId(userId);
    role = this.clearRoles(role);

    if (!userId || !role) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    if (!this.isUserExists(Meteor.userId())) {

        throw new Meteor.Error('empty-user', 'Пользователя с переданным userId не существует');
    }

    var roles_id = [];

    _.each(role, function (roleName) {

        var role_id = that.isRoleExists(roleName);

        if (!role_id) {

            throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
        } else {

            roles_id.push(role_id)
        }
    });

    _.each(roles_id, function (role_id) {

        UsersRoles.upsert({
            'userId': userId,
            'role_id': role_id
        }, {
            $set: {
                'userId': userId,
                'role_id': role_id
            }
        }, function (err) {

            if (err) {

                throw new Meteor.Error('error', err.reason);
            }
        });
    });

    return this;
};

YaAcl.prototype.removeUserRoles = function (userId, role /* String or Array */) {

    var that = this;

    userId = this.clearUserId(userId);
    role = this.clearRoles(role);

    if (!userId || !role) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    if (!this.isUserExists(Meteor.userId())) {

        throw new Meteor.Error('empty-user', 'Пользователя с переданным userId не существует');
    }

    var roles_id = [];

    _.each(role, function (roleName) {

        var role_id = that.isRoleExists(roleName);

        if (!role_id) {

            throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
        } else {

            roles_id.push(role_id)
        }
    });

    UsersRoles.upsert({
        'userId': userId,
        'role_id': {
            $in: roles_id
        }
    },
    function (err) {

        if (err) {

            throw new Meteor.Error('error', err.reason);
        }
    });

    return this;
};

YaAcl.prototype.userRoles = function (userId) {

    var that = this;

    userId = this.clearUserId(userId);

    if (!userId) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var userRolesIds = UsersRoles.find({
        'userId': userId
    },
    {
        'fields': {
            'role_id': 1
        }
    }).fetch();

    userRolesIds = _.pluck(userRolesIds, 'role_id');
    userRolesIds = _.uniq(userRolesIds);

    var rolesNames = AclRoles.find({
        '_id': {
            $in: userRolesIds
        }
    }).fetch();

    rolesNames = _.pluck(rolesNames, 'roleName');
    rolesNames = _.uniq(rolesNames);

    return rolesNames;
};

YaAcl.prototype.roleUsers = function (role /* String or Array */) {

    var that = this;

    role = this.clearRoles(role);

    if (!role) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var roles_id = [];

    _.each(role, function (roleName) {

        var role_id = that.isRoleExists(roleName);

        if (!role_id) {

            throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
        } else {

            roles_id.push(role_id)
        }
    });

    var userIds = UsersRoles.find({
        'role_id': {
            $in: roles_id
        }
    },
    {
        'fileds': {
            'userId': 1
        }
    }).fetch();

    userIds = _.pluck(userIds, 'userId');
    userIds = _.uniq(userIds);

    if (userIds.length) {

        return userIds;
    } else {

        return false;
    }
};

YaAcl.prototype.hasRole = function () {

};

YaAcl.prototype.addRole = function () {

};

YaAcl.prototype.removeRole = function () {

};

YaAcl.prototype.addResouce = function () {

};

YaAcl.prototype.removeResource = function () {

};

YaAcl.prototype.allow = function () {

};

YaAcl.prototype.removeAllow = function () {

};

YaAcl.prototype.allowedPermitions = function () {

};

YaAcl.prototype.isAllowed = function () {

};

YaAcl.prototype.getAllRoles = function () {

};

YaAcl.prototype.userIsInRole = function () {

};

// Private
YaAcl.prototype.clearRoles = function (roles) {

    // Clean Roles
    if (role) {

        if (_.isArray(role)) {

            _.each(role, function (element, index) {

                role[index] = YaFilter.clean({
                    'source': s(element.toString().toLowerCase()).trim().value(),
                    'type': 'Word'
                });

            });
        } else {

            role = YaFilter.clean({
                'source': s(role.toString().toLowerCase()).trim().value(),
                'type': 'Word'
            });

            role = [role];
        }

        return role;
    } else {

        return false
    }
};

YaAcl.prototype.clearUserId = function (userId) {

    // Clean userId
    userId = YaFilter.clean({
        'source': s(userId.toString().toLowerCase()).trim().value(),
        'type': 'AlNum'
    });

    check(userId, String);

    if (!userId) {

        return false;
    } else {

        return userId;
    }
};

YaAcl.prototype.isRoleExists = function (roleName) {

    var existedRole = AclRoles.findOne({'roleName': roleName});

    if (existedRole) {

        return existedRole._id;
    } else {

        return false;
    }
};

YaAcl.prototype.isUserExists = function (userId) {

    if (Meteor.users.findOne({_id: userId})) {

        return true;
    } else {

        return false;
    }
};
