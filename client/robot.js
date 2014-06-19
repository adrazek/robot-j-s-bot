var robotlibz = require('Robot(J)s');
var util = require('util');

module.exports = RobotClient;

function RobotClient(){}
util.inherits(RobotClient, robotlibz.BaseClient);

RobotClient.prototype.create = function(name){
	var me = this;
	this.emitTcp('robot create', {name: name}, function(data){
		var bot = robotService.create(data.bot);
		me.emit('info', {message: 'robot ' + bot.getName().green + ' created', bubbleEvent: 'robot created', bubbleData: bot});
	});
};
