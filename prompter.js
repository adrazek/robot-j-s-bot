var events = require('events');
var moment = require('moment');
var colors = require('colors');

var Prompter = function(){};

Prompter.super_ = events.EventEmitter;
Prompter.prototype = Object.create(events.EventEmitter.prototype, {
	constructor: {
		value: Prompter,
		enumerable: false,
	}
});

Prompter.prototype.socket = null;

Prompter.prototype.setSocket = function(socket){this.socket=socket;};
Prompter.prototype.getSocket = function(){return this.socket;};

Prompter.prototype.emitTcp = function(event, params, fn){this.getSocket().emit(event, params, fn);};
		
Prompter.prototype.logs = [];

Prompter.prototype.launch = function(){
	var robotlibz = require('Robot(J)s');
	var prompt = require('prompt');
	prompt.start();

	var reader = require('./util/command-reader');
	reader = new reader();
	var me=this;
	var prompter = function(err, result){
		
		if (result.cmd != 'exit')
		{
			retVal = reader.execute(result.cmd, me.socket);	
			if (retVal.error !== null)
				console.log(retVal.error);
		
			if (retVal.client !== null)	
				retVal.client.on('info', function(resp){
					me.log(resp.message);
					if (resp.bubbleEvent)
						me.emit(resp.bubbleEvent, resp.bubbleData);
				});
			
			if (me.logs.length > 0){
				console.log('\n > ' + 'Recent logs : \n'.blue);
				while(me.logs.length > 0){
					var log = me.logs.shift();
					console.log(' 	* '.green + log);
				}
				console.log('\n');
			}
			prompt.get(['cmd'], prompter);
		}
	};
	prompt.get(['cmd'], prompter);

};

Prompter.prototype.log = function(msg){
	this.logs.push('[' + moment().format() + '] ' + msg);
};

module.exports = Prompter;
