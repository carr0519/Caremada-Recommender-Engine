const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  'Title': String,
  'Genre': String,
  'Description': String,
  'Director': String,
  'Actors': String,
  'Year': Number,
  'Runtime (Minutes)': Number,
  'Rating': Number,
  'Votes': Number,
  'Revenue (Millions)': Number,
  'Metascore': Number
});

let headers = Object.keys(movieSchema.paths);
module.exports.model = mongoose.model('Movie', movieSchema);
module.exports.headers = headers;