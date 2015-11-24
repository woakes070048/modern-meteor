Notices = new Meteor.Collection(null);

showNotice = function (type, message) {
	
	Notices.remove({});
	Notices.insert({
		type: type,
		message: message,
		seen: false
	});
}

clearNotice = function () {
	
	Notices.remove({});
}