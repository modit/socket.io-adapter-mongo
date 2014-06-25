
/**
 * Module dependencies.
 */

var uid2    = require('uid2')
  , mubsub  = require('mubsub')
  , msgpack = require('msgpack-js')
  , Adapter = require('socket.io-adapter')
  , debug   = require('debug')('socket.io-mongo')
;

var URI_MATCH = /(?:mongodb\:\/\/)?(?:(.*)\:(.*)\@)?(.*)\:(\d+)(?:\/(.*))?/i;

/**
 * Module exports.
 */

module.exports = adapter;

/**
 * Returns a mongo Adapter class.
 *
 * @param {String} optional, mongo uri
 * @return {Mongo} adapter
 * @api public
 */

function adapter(uri, opts){
  opts = opts || {};

  // handle options only
  if ('object' == typeof uri) {
    opts = uri;
    uri = null;
  }

  // handle uri string
  uri = (uri || '').match(URI_MATCH);
  if (uri) {
    opts.username = uri[1];
    opts.password = uri[2];
    opts.host = uri[3];
    opts.port = uri[4];
    opts.db   = uri[5];
  }

  // opts
  var socket  = opts.socket;
  var creds   = (opts.username && opts.password) ? opts.username + ':' + opts.password + '@' : '';
  var host    = opts.host || '127.0.0.1';
  var port    = Number(opts.port || 27017);
  var db      = opts.db || 'mubsub';
  
  var client  = opts.client;
  var key     = opts.key || 'socket.io';

  // init clients if needed
  if (!client) client = socket ? mubsub(socket) : mubsub('mongodb://' + creds + host + ':' + port + '/' + db);

  // this server's key
  var uid = uid2(6);
  
  channel = client.channel(key);

  /**
   * Adapter constructor.
   *
   * @param {String} namespace name
   * @api public
   */

  function Mongo(nsp){
    Adapter.call(this, nsp);

    channel.subscribe(key, this.onmessage.bind(this));
  }

  /**
   * Inherits from `Adapter`.
   */

  Mongo.prototype.__proto__ = Adapter.prototype;

  /**
   * Called with a subscription message
   *
   * @api private
   */

  Mongo.prototype.onmessage = function(msg){
    if (uid == msg.uid || !msg.uid) return debug('ignore same uid');
    
    var args = msgpack.decode(msg.data.buffer);
    if (args[0] && args[0].nsp === undefined)
      args[0].nsp = '/';

    if (!args[0] || args[0].nsp != this.nsp.name) return debug('ignore different namespace');
    args.push(true);
    this.broadcast.apply(this, args);
  };

  /**
   * Broadcasts a packet.
   *
   * @param {Object} packet to emit
   * @param {Object} options
   * @param {Boolean} whether the packet came from another node
   * @api public
   */

  Mongo.prototype.broadcast = function(packet, opts, remote){
    Adapter.prototype.broadcast.call(this, packet, opts);
    
    if (!remote) {
      channel.publish(key, { uid: uid, data: msgpack.encode([packet, opts]) });
    }
  };

  return Mongo;

}
