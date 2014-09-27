# socket.io-adapter-mongo

[![Build Status](https://secure.travis-ci.org/modit/socket.io-adapter-mongo.png)](http://travis-ci.org/modit/socket.io-adapter-mongo)
[![NPM version](https://badge.fury.io/js/socket.io-adapter-mongo.png)](http://badge.fury.io/js/socket.io-adapter-mongo)

*This module is modified from [socket.io-redis](https://github.com/Automattic/socket.io-redis)

## How to use

```js
var io = require('socket.io')(3000);
var mongo = require('socket.io-adapter-mongo');
io.adapter(mongo({ host: 'localhost', port: 27017, db: 'mubsub' }));
```

By running socket.io with the `socket.io-adapter-mongo` adapter you can run
multiple socket.io instances in different processes or servers that can
all broadcast and emit events to and from each other.

## API

### adapter(uri[, opts])

`uri` is a string that matches a mongodb connection string
```
mongodb://localhost:27017
mongodb://user:pass@localhost:27017/test
localhost:27017
```

### adapter(opts)

The following options are allowed:

- `key`: the name of the key to pub/sub events on as prefix (`socket.io`)
- `host`: host to connect to mongo on (`localhost`)
- `port`: port to connect to mongo on (`27017`)
- `db`: db to use in mongo (`mubsub`)
- `username`: username to connect to mongo with
- `password`: password to connect to mongo with
- `socket`: unix domain socket to connect to mongo (`"/tmp/mongo.sock"`). Will
  be used instead of the host and port options if specified.
- `client`: optional, the mubsub client to publish events on

If you decide to supply a client, make sure you use [mubsub](https://github.com/scttnlsn/mubsub) as a client or one with an equivalent API.

## License

MIT
