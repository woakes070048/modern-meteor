Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
});

Router.map(function () {
    this.route('indexPage', {
        path: '/'
    });
});

Router.map(function () {
    this.route('loginForm', {
        'path': '/login'
    });
});


var BeforeHooks = {

    'isAllowed': function () {

        console.log(this.resource);
        console.log(this.neededPermitions);

        this.next();
    },

    'setActiveMenu': function () {

        if (Meteor.isClient) {

            Session.set('activeMenuItem', Router.current().route.getName());
        }

        this.next();
    },

    'clearNotice': function() {

        clearNotice();
        this.next();
    }
}

_.each(BeforeHooks, function (BeforeHook) {

    Router.onBeforeAction(BeforeHook);
});
