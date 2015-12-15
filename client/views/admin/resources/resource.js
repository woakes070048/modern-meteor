var eventsMap = EventsMapConstructor('resource', [
        {
            'name': 'resourceName',
            'type': 'word',
            'defaultVal': '',
            'inputType': 'input'
        }
    ],
    [
        {
            'fieldName': 'resourceName'
        }
    ],
    false
);

Template.resource.events(eventsMap);
