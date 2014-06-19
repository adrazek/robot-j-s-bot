var robotlibz = require('Robot(J)s');
var util = require('util');

module.exports = RingClient;

function RingClient(){}
util.inherits(RingClient, robotlibz.BaseClient);

RingClient.prototype.list = function(){
	var me = this;
	this.emitTcp('ring list', {}, function(data){
		var rings = [];
		var message = 'ring list :\n\n';
		for (var i in data.rings)
		{
			var ring = ringService.create(data.rings[i]);
			rings.push(ring);
			message += '\t\t* '.red + ring.name.blue + '[' + ring.getWidth() + ', ' + ring.getHeight() + ']\n';
		}

		me.emit('info', {message: message, bubbleEvent: 'ring list', bubbleData: rings});
	});
};

RingClient.prototype.create = function(name, width, height){
	var me = this;
	this.emitTcp('ring create', {name: name, width: width, height: height}, function(data){
		var ring = robotService.create(data.ring);
		me.emit('info', {message: 'ring ' + ring.getName().green + ' created', bubbleEvent: 'ring created', bubbleData: ring});
	});
};

RingClient.prototype.join = function(ring, bot){
	var me = this;
	this.emitTcp('ring join', {ring: ring, bot: bot}, function(data){
		var ring = ringService.create(data.ring);
		var bot = robotService.create(data.bot);
		me.emit('info', {message: 'robot ' + bot.getName().green + ' has join the ring ' + ring.getName().yellow, bubbleEvent: 'A robot join a ring', bubbleData: {bot: bot, ring: ring}});
	});
};

RingClient.prototype.launch = function(ring){
	var me = this;
	this.emitTcp('ring launch', {ring: ring}, function(data){
		var ring = ringService.create(data.ring);
		me.emit('info', {message: 'ring ' + ring.getName().yellow + ' has been launched !', bubbleEvent: 'ring launched', bublleData: {ring: ring}});
	});
};
