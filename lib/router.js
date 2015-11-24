
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
    this.route('loginForm', {
        'path': '/login'
    });
});

Router.before(function() { clearNotice(); this.next(); });



// Hooks functions
requireClientLogin = function () {
    if (! Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin', 'manager', 'client'])) {

        if (Meteor.loggingIn()) {

            this.render(this.loadingTemplate);
        } else {

            Router.go('indexPage');
        }
    } else {

        this.next();
    }
};

requireManagerLogin = function () {
    if (! Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin', 'manager'])) {

        if (Meteor.loggingIn()) {

            this.render(this.loadingTemplate);
        } else {

            Router.go('indexPage');
        }
    } else {

        this.next();
    }
};

requireAdminLogin = function () {
    if (! Meteor.user() || !Roles.userIsInRole(Meteor.user(), ['admin'])) {

        if (Meteor.loggingIn()) {

            this.render(this.loadingTemplate);
        } else {

            Router.go('indexPage');
        }
    } else {

        this.next();
    }
};

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
