Template.notice.events({

	'click .close': function (event) {

		event.preventDefault();

		clearNotice();
		//console.log(this);
	}

});

/*Template.notice.rendered = function () {

	var notice = this.data;

	Meteor.defer(function () {

		Notices.update(notice._id, {$set: {seen: true}});
	});
};*/