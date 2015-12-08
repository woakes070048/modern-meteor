var eventsMap = EventsMapConstructor('role', [
        {
            'name': 'roleName',
            'type': 'word',
            'defaultVal': '',
            'inputType': 'input'
        }
    ],
    [
        {
            'fieldName': 'roleName'
        }
    ],
    false
);

Template.role.events(eventsMap);
