
exports.up = function (knex, Promise) {
	return Promise.all([
		knex.schema
			.createTableIfNotExists('books', function (wordsTable) {
				// primary Key
				wordsTable.increments('id').primary()
				// data
				wordsTable.string('book_title', 1000).notNullable()
				wordsTable.string('bookAuthor', 100)
				wordsTable.string('releaseDate', 50)
				wordsTable.string('genres', 1000)
				wordsTable.text('summary').notNullable()

			})
			
	]);

};

exports.down = function (knex, Promise) {
	return Promise.all([
		//remember to drop a refrencing table first
		knex
			.schema
			.dropTableIfExists('books')
	]);

};
