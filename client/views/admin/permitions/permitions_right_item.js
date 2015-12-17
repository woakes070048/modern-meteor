Template.resourceRightsItem.helpers({
    'rolesArr': function () {

        var that = this;

        var roles = AclRoles.find().fetch();

        var rolesArr = [];

        _.each(roles, function (role) {

            var permNames = ['list', 'read', 'edit', 'create', 'delete'];

            var permArr =[];

            _.each(permNames, function (permName) {

                var rolePerm = RolesPermitions.findOne({
                    'resource_id': that._id,
                    'permition': permName,
                    'role_id': role._id
                });

                var fields = '';

                var isActive = '';

                if (rolePerm) {

                    if (rolePerm.fields && _.isArray(rolePerm.fields)) {

                        _.each(fileds, function (field, index) {

                            if (index !== 0) {

                                fields += ';';
                            }

                            fileds += field.toString();
                        });
                    }

                    isActive = 'checked';
                }

                permArr.push({
                    'permitionName': permName,
                    'permitionId': 'perm-' + permName + '-' + role.roleName + '-' + that.resourceName,
                    'fieldsId': 'fields-' + permName + '-' + role.roleName + '-' + that.resourceName,
                    'fields': fields,
                    'isActive': isActive
                });
            });

            rolesArr.push({
                'roleName': role.roleName,
                'permArr': permArr
            });
        });

        return rolesArr;
    }
});
