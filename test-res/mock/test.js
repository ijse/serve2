module.exports = function(req, res, next) {

  console.log(req.query.hi);
  console.log(req.body);
  res.end('Hello, this is javascript file mock result.');
}