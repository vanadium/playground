var inherits = require('util').inherits;
var vanadium = require('vanadium');

var pingpong = require('../pingpong');

function PingPongService() {}

inherits(PingPongService, pingpong.PingPong);

PingPongService.prototype.ping = function(ctx, message) {
  console.log('[' + ctx.remoteBlessingStrings + '] ' + message);
  return 'PONG';
};

var pingPongService = new PingPongService();

vanadium.init(function(err, rt) {
  if (err) throw err;

  console.log('Starting server');
  rt.newServer().serve('pingpong', pingPongService, function(err) {
    if (err) throw err;

    console.log('Serving pingpong');
  });
});
