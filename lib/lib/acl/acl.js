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
    role = this.clearWords(role);

    if (!userId || !role) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    if (!this.isUserExists(Meteor.userId())) {

        throw new Meteor.Error('empty-user', 'Пользователя с переданным userId не существует');
    }

    var currentUserId = this.clearUserId(Meteor.userId());

    if (!this.isAllowed(currentUserId, 'roles', ['read', 'create', 'edit', 'delete'])) {

        throw new Meteor.Error('have-no-permitions', 'У Вас нет прав на совершение дествия');
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
    role = this.clearWords(role);

    if (!userId || !role) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    if (!this.isUserExists(userId)) {

        throw new Meteor.Error('empty-user', 'Пользователя с переданным userId не существует');
    }

    var currentUserId = this.clearUserId(Meteor.userId());

    if (!this.isAllowed(currentUserId, 'roles', ['read', 'create', 'edit', 'delete'])) {

        throw new Meteor.Error('have-no-permitions', 'У Вас нет прав на совершение дествия');
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
        },
        {
            $set: {
                'userId': userId,
                'role_id': role_id
            }
        },
        function (err) {

            if (err) {

                throw new Meteor.Error('error', err.reason);
            }
        });
    });

    return this;
};

YaAcl.prototype.userRoles = function (userId) {

    var that = this;

    userId = this.clearUserId(userId);

    if (!userId) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var currentUserId = this.clearUserId(Meteor.userId());

    if (!this.isAllowed(currentUserId, 'roles', ['read', 'create', 'edit', 'delete'])) {

        throw new Meteor.Error('have-no-permitions', 'У Вас нет прав на совершение дествия');
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

    role = this.clearWords(role);

    if (!role) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var currentUserId = this.clearUserId(Meteor.userId());

    if (!this.isAllowed(currentUserId, 'roles', ['read', 'create', 'edit', 'delete'])) {

        throw new Meteor.Error('have-no-permitions', 'У Вас нет прав на совершение дествия');
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

YaAcl.prototype.hasRole = function (userId, roleName) {

    userId = this.clearUserId(userId);

    if (!userId) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    roleName = YaFilter.clean({
        'source': s(roleName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!roleName) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var role_id = that.isRoleExists(roleName);

    if (!role_id) {

        throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
    }

    var user = UsersRoles.findOne({
        'userId': userId,
        'role_id': role_id
    });

    if (user) {

        return true;
    } else {

        return false;
    }
};

YaAcl.prototype.addRole = function (roleName) {

    var currentUserId = this.clearUserId(Meteor.userId());

    if (!this.isAllowed(currentUserId, 'roles', ['read', 'create', 'edit', 'delete'])) {

        throw new Meteor.Error('have-no-permitions', 'У Вас нет прав на совершение дествия');
    }

    roleName = YaFilter.clean({
        'source': s(roleName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!roleName) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var role_id = that.isRoleExists(roleName);

    if (!role_id) {

        AclRoles.insert({
            'roleName': roleName
        });
    }

    return this;
};

YaAcl.prototype.removeRole = function (roleName) {

    var currentUserId = this.clearUserId(Meteor.userId());

    if (!this.isAllowed(currentUserId, 'roles', ['read', 'create', 'edit', 'delete'])) {

        throw new Meteor.Error('have-no-permitions', 'У Вас нет прав на совершение дествия');
    }

    roleName = YaFilter.clean({
        'source': s(roleName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!roleName) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var role_id = that.isRoleExists(roleName);

    if (role_id) {

        AclRoles.remove({
            'roleName': roleName
        });
    }

    return this;
};

YaAcl.prototype.addResouce = function (resourceName) {

    var currentUserId = this.clearUserId(Meteor.userId());

    if (!this.isAllowed(currentUserId, 'roles', ['read', 'create', 'edit', 'delete'])) {

        throw new Meteor.Error('have-no-permitions', 'У Вас нет прав на совершение дествия');
    }

    resourceName = YaFilter.clean({
        'source': s(resourceName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!resourceName) {

        throw new Meteor.Error('empty-params', 'resourceName не передан в метод');
    }

    var resource_id = that.isResourceExists(resourceName);

    if (!resource_id) {

        Resources.insert({
            'resourceName': resourceName
        });
    }

    return this;
};

YaAcl.prototype.removeResource = function (resourceName) {

    var currentUserId = this.clearUserId(Meteor.userId());

    if (!this.isAllowed(currentUserId, 'roles', ['read', 'create', 'edit', 'delete'])) {

        throw new Meteor.Error('have-no-permitions', 'У Вас нет прав на совершение дествия');
    }

    resourceName = YaFilter.clean({
        'source': s(resourceName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!resourceName) {

        throw new Meteor.Error('empty-params', 'resourceName не передан в метод');
    }

    var resource_id = that.isResourceExists(resourceName);

    if (!resource_id) {

        Resources.remove({
            'resourceName': resourceName
        });
    }

    return this;
};

YaAcl.prototype.allow = function (roles, resources, permitions) {

    var currentUserId = this.clearUserId(Meteor.userId());

    if (!this.isAllowed(currentUserId, 'roles', ['read', 'create', 'edit', 'delete'])) {

        throw new Meteor.Error('have-no-permitions', 'У Вас нет прав на совершение дествия');
    }

    roles = this.clearWords(roles);
    resources = this.clearWords(resources);
    permitions = this.clearWords(permitions);

    if (!roles || !resources || !permitions) {

        throw new Meteor.Error('empty-params', 'Не все параметры переданы в метод');
    }

    var roles_id = [];

    _.each(roles, function (roleName) {

        var role_id = that.isRoleExists(roleName);

        if (!role_id) {

            throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
        } else {

            roles_id.push(role_id)
        }
    });

    var resources_id = [];

    _.each(resources, function (resourceName) {

        var resource_id = that.isResourceExists(resourceName);

        if (!resource_id) {

            throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
        } else {

            resources_id.push(resource_id)
        }
    });

    _.each(roles_id, function (role_id) {

        _.each(resources_id, function (resource_id) {

            _.each(permitions, function (permition) {

                RolesPermitions.upsert({
                    'role_id': role_id,
                    'resource_id': resource_id,
                    'permition': permition
                },
                {
                    $set: {
                        'role_id': role_id,
                        'resource_id': resource_id,
                        'permition': permition
                    }
                }, function (err) {

                    if (err) {

                        throw new Meteor.Error('error', err.reason);
                    }
                });

            });
        });
    });

    return this;
};

YaAcl.prototype.removeAllow = function (role, resources, permitions) {

    var currentUserId = this.clearUserId(Meteor.userId());

    if (!this.isAllowed(currentUserId, 'roles', ['read', 'create', 'edit', 'delete'])) {

        throw new Meteor.Error('have-no-permitions', 'У Вас нет прав на совершение дествия');
    }
};

YaAcl.prototype.allowedPermitions = function (userId, resources /* String or Array */) {

};

YaAcl.prototype.isAllowed = function (userId, resource, permitions) {

    resource = YaFilter.clean({
        'source': s(resource.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    permitions = this.clearWords(permitions);

    var allowedPermitions = this.allowedPermitions(userId, resource);

    if (_.isArray(allowedPermitions[resource])) {

        var permitionsIntersect = _.intersection(permitions, allowedPermitions[resource]);

        if (permitionsIntersect.length === permitions.length) {

            return true;
        } else {

            return false;
        }
    } else {

        return false;
    }
};

YaAcl.prototype.getAllRoles = function () {

    var currentUserId = this.clearUserId(Meteor.userId());

    if (!this.isAllowed(currentUserId, 'roles', ['read', 'create', 'edit', 'delete'])) {

        throw new Meteor.Error('have-no-permitions', 'У Вас нет прав на совершение дествия');
    }
};

YaAcl.prototype.userIsInRole = function (userId, roleName) {

};

YaAcl.prototype.areAnyRolesAllowed = function (roles, resource, permitions) {

};

YaAcl.prototype.whatResources = function (roles) {

};

// Private
YaAcl.prototype.clearWords = function (role) {

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

    roleName = YaFilter.clean({
        'source': s(roleName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!roleName) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var existedRole = AclRoles.findOne({'roleName': roleName});

    if (existedRole) {

        return existedRole._id;
    } else {

        return false;
    }
};

YaAcl.prototype.isResourceExists = function (resourceName) {

    resourceName = YaFilter.clean({
        'source': s(resourceName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!resourceName) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var existedResource = Resources.findOne({'resourceName': resourceName});

    if (existedResource) {

        return existedResource._id;
    } else {

        return false;
    }
};

YaAcl.prototype.isUserExists = function (userId) {

    userId = this.clearUserId(userId);

    if (!userId) {

        return false;
    }

    if (Meteor.users.findOne({_id: userId})) {

        return userId;
    } else {

        return false;
    }
};
