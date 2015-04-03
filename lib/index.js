
var resolve = require('path').resolve;
var join = require('path').join;
var exec = require('child_process').exec;
var stylus = require('stylus');
var jade = require('jade');
var less = require('less-middleware');
var url = require('url');
var proxy = require('proxy-middleware');
var fs = require('fs');
var connect = require('connect');

exports.createServer = function(program) {
  var server = connect();

  // path
  var path = resolve(program.args.shift() || '.');

  // setup the server
  var server = connect();

  // basic auth

  if (program.auth) {
    var user = program.auth.split(':')[0];
    var pass = program.auth.split(':')[1];
    if (!user || !pass) throw new Error('user and pass required');
    server.use(connect.basicAuth(user, pass));
  }

  // ignore favicon
  server.use(connect.favicon(program.favicon));

  // logger
  if (program.logs) server.use(connect.logger(program.format));

  // convert .styl to .css to trick stylus.middleware
  if (program.stylus) {
    server.use(function(req, res, next){
      req.url = req.url.replace(/\.styl$/, '.css');
      next();
    });
  }

  // jade
  if (program.jade) {
    server.use(function(req, res, next){
      if (!req.url.match(/\.jade$/)) return next();
      var file = join(path, url.parse(req.url).pathname);
      fs.readFile(file, 'utf8', function(err, str){
        if (err) return next(err);
        try {
          var fn = jade.compile(str, { filename: file });
          str = fn();
          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Content-Length', Buffer.byteLength(str));
          res.end(str);
        } catch (err) {
          next(err);
        }
      });
    });
  }

  // stylus
  server.use(stylus.middleware({ src: path }));

  // less
  if (program.less) {
    server.use(less(path));
  }

  // CORS access for files
  if (program.cors) {
    server.use(function(req, res, next){
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, x-csrf-token, origin');
      if ('OPTIONS' == req.method) return res.end();
      next();
    });
  }

  // compression
  if (program.compress) {
    server.use(connect.compress());
  }

  // exec command
  if (program.exec) {
    server.use(function (req, res, next){
      exec(program.exec, next);
    });
  }

  // check if .proxylist exists...
  var proxyFile = join(path, 'proxylist.json');
  if (fs.existsSync(proxyFile)) {
    var proxyList = {};

    function readProxyFile() {
      fs.readFile(proxyFile, function(err, data) {
        proxyList = JSON.parse(''+data);
      });
    }
    // initially reading proxy file
    readProxyFile();
    // watch proxyfile changes
    fs.watchFile(proxyFile, readProxyFile);

    // apply proxy at each request
    server.use("/", function(req, res, next) {
      var proxyTo = proxyList[req._parsedUrl.pathname];
      if(!proxyTo) {
        return next();
      } else {
        var proxyOptions = url.parse(proxyTo);
        return proxy(proxyOptions)(req, res, next);
      }
    });
  }

  // cookies parse support
  if (program.cookies) {
    server.use(connect.cookieParser());
  }

  // use mock files
  if (program.mocks) {

    var mockDir = join(path, program.mocks);

    server.use(connect.query());
    server.use(connect.bodyParser());

    server.use(function (req, res, next){
      var mfile = join(mockDir, req._parsedUrl.pathname);

      try {
        delete require.cache[require.resolve(mfile)];
        var mock = require(mfile);

        if(typeof mock === 'function') {
          try {
            mock(req, res, next);
          } catch(e) {
            console.error(e);
          }
        } else if(typeof mock === 'object') {

          // try parsing as json
          var mockStr = '';
          try {
            mockStr = JSON.stringify(mock);
          } catch(e) {
            // Wrong type of json(val)
            console.error(e);
          }
          res.end(mockStr);
        }
      } catch(e) {
        if(e.name === 'ReferenceError') {
          // read file as plain text and return
          res.end('' + fs.readFileSync(mfile));
        } else {
          // no mock file found
          next();
        }
      }

    });
  }

  // static files
  server.use(connect.static(path, { hidden: program.hidden }));

  // directory serving

  if (program.dirs) {
      server.use(connect.directory(path, {
        hidden: program.hidden
      , icons: program.icons
    }));
  }

  return server;

};