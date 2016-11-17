var users = require('../../app/controllers/users.server.controller'),
	books = require('../../app/controllers/books.server.controller');

module.exports = function(app) {
	app.route('/api/books')
		.get(books.list)
		.post(users.requiresLogin, books.create);

	app.route('/api/books/:bookId')
		.get(books.read)
		.put(users.requiresLogin, books.hasAuthorization, books.update)
		.delete(users.requiresLogin, books.hasAuthorization, books.delete);

	app.param('bookId', books.bookByID);
};