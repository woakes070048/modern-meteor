Template.loginForm.events({

    'submit #login-form': function (e) {

        var loginVal,
            passwordVal;

        e.preventDefault();

        $('#login').removeClass('invalid');
        $('#password').removeClass('invalid');

        loginVal = YaUtilities.toMobile($.trim(YaRequest.getNumber('login', '', 'INPUT')));
        passwordVal = $.trim(YaRequest.getAlnum('password', '', 'INPUT'));

        if (!loginVal || !YaUtilities.checkMobile(loginVal)) {

            $('#login').addClass('invalid');
            return;
        }

        if (!passwordVal) {

            $('#password').addClass('invalid');
            return;
        }


        Meteor.loginWithPassword(loginVal.toString(), passwordVal, function (error) {

            if (error) {

                showNotice('error', 'Неверный логин или пароль.');
            }

            Router.go('chat');
        });
    }
});
