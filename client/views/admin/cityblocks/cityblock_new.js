var eventsMap = EventsMapConstructor('cityblock', [
        {
            'name': 'cityBlockName',
            'type': 'string',
            'defaultVal': '',
            'inputType': 'input'
        },
        {
            'name': 'city_id',
            'type': 'alnum',
            'defaultVal': '',
            'inputType': 'input'
        },
        {
            'name': 'isActive',
            'type': 'bool',
            'defaultVal': false,
            'inputType': 'select'
        }
    ],
    [
        {
            'fieldName': 'cityBlockName'
        },
        {
            'fieldName': 'city_id'
        }
    ],
    true
);


Template.cityblockNew.events(eventsMap);