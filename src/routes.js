const Boom = require('boom');
const knex = require('./knex')

module.exports = [
	{
		method: 'GET',
		path: '/home',
		config: {
			description: 'random books',
			notes: 'random books',
			tags: ['api']
		},
		handler: (request, h) => {
			let pr = (resolve, reject) => {
				knex("books").select("id","book_title","bookAuthor","releaseDate","genres","summary")
					.orderByRaw('rand()')
					.limit(16)
					.then((result) => {
						return resolve(result)
					})
					.catch((error) => {
						return reject(Boom.forbidden(error))
					})
					
			}
			return new Promise(pr)
		}
	},
	{
		method: 'GET',
		path: '/all_books',
		config: {
			description: 'All books',
			notes: 'All books',
			tags: ['api']
		},
		handler: (request, h) => {
			const {page_no} = request.query;
			let number = 100;
			let pr = (resolve, reject) => {
				knex("books").select("id","book_title","bookAuthor","releaseDate","genres","summary")
					.then((result) => {
						if (page_no == undefined) {
							// console.log(number-1)
							return resolve(result.slice(0,number))
							
						} else if (page_no !== "" ) {
							let start=parseInt(page_no)*number
							return resolve(result.slice(start,start+number))
							// console.log(parseInt(page_no))
						}
					})
					.catch((error) => {
						return reject(Boom.forbidden(error))
					})
					
			}
			return new Promise(pr)
		}
	},
	{
		method: 'POST',
		path: '/post_book',
		config: {
			description: 'post book',
			notes: 'post book',
			tags: ['api']
		},
		handler: (request, h) => {
			let pr = (resolve, reject) => {
		
				knex("books").insert({
					book_title:request.payload.book_title,
					bookAuthor:request.payload.bookAuthor,
					releaseDate:request.payload.releaseDate,
					genres:request.payload.genres,
					summary:request.payload.summary,
				})
				
				.then((result1) => {

					return resolve(request.payload)


				})
				.catch((error) =>{
					return reject(Boom.forbidden(error))
				})
					
					
			}
			return new Promise(pr)
		}
	}
	

	
]
