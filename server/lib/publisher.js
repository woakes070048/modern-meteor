// To Do - check errors and types of params
YaPublisher = function (publishCollection, publishResource, publishPermitions, publishFilters) {

        return function (attributes) {

            if (this.userId) {

                var userId = YaFilter.clean({
                    source: s(this.userId).trim().value(),
                    type: 'AlNum'
                });
            } else {

                var userId = null;
            }

            var AclPublish = new AclForPublish(userId);

            var isAllowedPub = AclPublish.isAllowed(userId, publishResource, publishPermitions);

            if (isAllowedPub) {

                if (!publishFilters || !(_.isFunction(publishFilters))) {

                    filters = {};
                } else {

                    filters = publishFilters(this, attributes);
                }

                var allowedFields = [];

                var toUnite = true;

                _.each(publishPermitions, function (publishPermition, index) {

                    var allowedFieldsForCurrentPerm  = AclPublish.allowedFields(userId, publishResource, publishPermition);

                    if (toUnite) {

                        if (allowedFieldsForCurrentPerm && _.isArray(allowedFieldsForCurrentPerm)) {

                            allowedFields = _.union(allowedFields, allowedFieldsForCurrentPerm);

                            toUnite = false;
                        }
                    } else {

                        if (allowedFieldsForCurrentPerm && _.isArray(allowedFieldsForCurrentPerm)) {

                            allowedFields = _.intersection(allowedFields, allowedFieldsForCurrentPerm);
                        }
                    }
                });


                if (allowedFields && _.isArray(allowedFields) && allowedFields.length) {

                    var fields = {};

                    _.each(allowedFields, function (allowedField) {

                        allowedField = YaFilter.clean({
                            source: s(allowedField).trim().value(),
                            type: 'AlNum'
                        });

                        fields[allowedField] = 1;
                    });

                    return publishCollection.find(filters,
                    {
                        'fields': fields
                    });
                } else {

                    return publishCollection.find(filters);
                }
            } else {

                // User does not have permissions
                this.ready();
                return [];
            }
        }
}
