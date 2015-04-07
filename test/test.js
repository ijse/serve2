
var should = require('should');
var request = require('supertest');

var Serve2 = require('../lib');

function create(command) {
  return new Serve2(command).getInstance();
}

describe('Test serve2 interface', function() {

  it('support commander instance object as argument', function() {
    (function() {
      var arg = require('../lib/cli.js').parse([]);
      var server = new Serve2(arg).getInstance();
    }).should.not.throw();
  });

  it('should throw error when args is not valid', function() {
    (function() {
      var server = new Serve2(null).getInstance();
    }).should.throw();
  });

  it('should throw error when args is array', function() {
    (function() {
      var server = new Serve2([]).getInstance();
    }).should.not.throw();
  });

});

describe('Test serve2 lib with all default', function() {
  var server = create([]);
  it('use current folder as default', function(done) {
    request(server)
      .get('')
      .expect(200)
      .expect(/bin/)
      .expect(/lib/)
      .expect(/test/)
      .expect(/Readme\.md/)
      .expect(/package.json/)
      .end(done);
  });

  it('response one static file', function(done) {
    request(server)
      .get('/package.json')
      .expect(200)
      .expect(/version/)
      .end(done);
  });
});

describe('Test Serve2 lib with mock file on 9876 port', function() {

  var server = create([ , , '-M', 'mock', '-p', '9876', './test/test-res']);
  it('support static file', function(done) {

    request(server)
      .get('/')
      .expect(200)
      .expect(/\<html/)
      .expect(/Hello, this is just file response/)
      .end(done);
  });

  it('support directory', function(done) {
    request(server)
      .get('/mock/')
      .set('Accept', 'text/plain')
      .expect(200)
      .expect(/test\.js/)
      .expect(/test\.json/)
      .expect(/text/)
      .end(done)
  });

  it('got 404 when request a file not exists', function(done) {
    request(server)
      .get('/file-dont-exist')
      .expect(404)
      .end(done);
  });

  it('support directory in json', function(done) {
    request(server)
      .get('/mock/')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(['test.js', 'test.json', 'text'])
      .end(done)
  });


  it('response with data from mock js file', function(done) {
    request(server)
      .get('/test.js')
      .expect(200)
      .expect(/Hello, this is javascript file mock result./)
      .end(done);
  });

});
