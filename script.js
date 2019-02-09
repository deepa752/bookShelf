const fs = require('fs');

var knexfile = require('./knexfile.js');
var knex = require('knex')(knexfile.development);

const tableName = 'books';
const getPromises = (rows) => {
  return rows.map((row) => 
  new Promise((resolve, reject)=> {
          knex(tableName).insert(row)
              .then((data) => {
                //   console.log(data)
                  resolve("inserted");
              });
          
      
  })
);
};

const callPromises = (rows) => {
  first_1000_rows = rows.slice(0,1000);
  promises = getPromises(first_1000_rows);
  remaining_rows = rows.slice(1000, rows.length);

  Promise.all(promises)
  .then((data) =>
      {
          console.log("remaining ", remaining_rows.length);


          if (remaining_rows.length === 0){
              process.exit(1);
          }
          else{
              callPromises(remaining_rows);
          }
      })
  .catch((error) => {
      console.log(error ,"errrr");
      process.exit();
  });
}


fs.readFile('booksummaries.txt', function (err, data) {
  if (err) throw err;
  let bookInfo = data.toString().split("\n")
  let rows = [];
  for (let i = 0; i < bookInfo.length ; i++) {
    let dic = {};  
    const element = bookInfo[i];
     let info = element.split(/\t/g);
     let bookTitle = info[2]
     let bookAuthor = info[3]
     let date = info[4]
     let genre = info[5]
     if (genre !== ''){
        genre = genre.split(',')
     }
     let listOfGenres =[]
     if (genre[0] !== ""){ 
     for (let i = 0; i < genre.length; i++) {
         let element = genre[i].split(':')[1].split('"')[1];
         element = element.split(' \\')[0]
         // console.log(element)  
         listOfGenres.push(element)
     } }
     let summary = info[6]
     dic["book_title"] = bookTitle
     if (bookAuthor !== ""){
        dic["bookAuthor"] = bookAuthor
     }
     if (date !== "" ){
        dic["releaseDate"]=date
     }
     if (listOfGenres.length !== 0 ){
       let genres = listOfGenres.join(',')

        dic["genres"]= genres

     }
     dic["summary"]=summary
     rows.push(dic)
    
    }
    callPromises(rows);
    
});
