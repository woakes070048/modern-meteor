
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
});

prevRoute = '';
prevFindOpts = {};

Router.map(function () {
    this.route('indexPage', {
        path: '/'
    });
});

Router.map(function () {
    this.route('adminIndexPage', {
        'path': '/admin',

        'data': function () {

            return {
                'adminLayout': true
            };
        }
    });
});

Router.map(function () {
    this.route('loginForm', {
        'path': '/login'
    });
});

Router.before(function() { clearNotice(); this.next(); });

// Hooks functions
setActiveMenu = function () {

    if (Meteor.isClient) {

        Session.set('activeMenuItem', Router.current().route.getName());
    }

    this.next();
}


Router.onStop(function () {

    prevRoute = Router.current().route.getName();

    if (Router.current().findOptions) {

        prevFindOpts = Router.current().findOptions();
    } else {

        prevFindOpts = {};
    }
});

Router.onBeforeAction(setActiveMenu);
