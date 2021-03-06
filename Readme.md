
# serve2

> If you want to set up simple http services with **more than** a static server, you're gonna need this!

  Forked from [tj/serve](http://github.com/visionmedia/serve), add dynamic file process function. Since it's now more than a *file / directory server*, I create a new repository.

  We can use `serve2` not only serve static file and directories, but dynamic process the http requests, even proxy.


中文说明： https://www.ijser.cn/simple-command-line-node-js-server/

[ ![Codeship Status for ijse/serve2](https://codeship.com/projects/b9dfa670-c3df-0132-ef2d-2afb1ee8c2f8/status?branch=master)](https://codeship.com/projects/73961)

## Installation

    $ npm install -g serve2

## Usage

```

Usage: serve2 [options] [dir]

Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -a, --auth <user>:<pass>  specify basic auth credentials
    -F, --format <fmt>        specify the log format string
    -p, --port <port>         specify the port [3000]
    -H, --hidden              enable hidden file serving
    -S, --no-stylus           disable stylus rendering
    -J, --no-jade             disable jade rendering
        --no-less             disable less css rendering
    -I, --no-icons            disable icons
    -L, --no-logs             disable request logging
    -D, --no-dirs             disable directory serving
    -f, --favicon <path>      serve the given favicon
    -M, --mocks <path>        mock files directory
        --cookies             add cookies parse support
    -C, --cors                allows cross origin access serving
        --compress            gzip or deflate the response
        --exec <cmd>          execute command on each request

```

## Examples

  Mock files:

    // mock/test.js
    module.exports = function(req, res, next) {
      var query = req.query;
        var reqBody = req.body;
        // ...
        res.end(query.hi);
    }

    $ serve2 -M ./mock
    serving E:\worktop\serve2\test-res on port 3000
    
  Mock mapping files:
  
    // mock/_map
    /url1 test.js
    /url2 test.json
    
  So that when request `/url1`, it will use mock `test.js`, and so on.

  HTTP Accept support built into `connect.directory()`:

     $ curl http://local:3000/ -H "Accept: text/plain"
     bin
     History.md
     node_modules
     package.json
     Readme.md

  Requesting a file:

    $ curl http://local:3000/Readme.md

     # serve
     ...

  Requesting JSON for the directory listing:

    $ curl http://local:3000/ -H "Accept: application/json"
    ["bin","History.md","node_modules","package.json","Readme.md"]

  Http proxy:

    // proxylist.json
    {
      "/": "http://www.baidu.com",
      "/t/180521": "https://www.v2ex.com"
    }

  done!

 Directory listing served by connect's `connect.directory()` middleware.

  ![directory listings](http://f.cl.ly/items/100M2C3o0p2u3A0q1o3H/Screenshot.png)

## Contribution

```
npm install --development
npm test
```

## License

(The MIT License)

Copyright (c) 2011 TJ Holowaychuk &lt;tj@vision-media.ca&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
