/**
 * Main requirements
 */
var colors = require('colors');
var moment = require('moment');
var robotlibz = require('Robot(J)s');
var fs = require('fs');
var lbl = require('line-by-line');

/**
 * Initializing socket
 */
var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', connect);
socket.on('disconnect', disconnect);
socket.on('info', receiveServerInfo);
socket.on('command', executeCommand);

var connected = false;

/**
 * Initializing main services
 */
var robotService = robotlibz.getRobotService(); 
var ringService = robotlibz.getRingService(); 

/**
 * Initiliazing main data
 */
var bot=null;

/**
 * Initializing prompter
 */
var prompter = require('./prompter');
var prompt = new prompter();
prompt.setSocket(socket);


/**
 *  LAUNCHING PROGRAM
 */
function launch(){
	/**
	 * Lauching base commands
	 */
	var reader = new lbl('data/base_2.cmd');

	var cmdReader = require('./util/command-reader');
	cmdReader = new cmdReader();

	reader.on('error', function(err){
		log(err);
	}),
	reader.on('line', function(line){
		log(line.yellow);
		retVal = cmdReader.execute(line, socket);	
		if (retVal.error !== null)
			console.log(retVal.error);
	});
	reader.on('end', function(){

	});

	/**
	 *  Launching prompter
	 */
	prompt.launch();
}

/**
 *  Listening events
 */
prompt.on('robot created', function(robot){
	bot = robot;
});

prompt.on('ring list', function(rings){
});

/**
 * Socket events
 */
function connect(){
	connected = true;
	log('You are ' + 'connected'.yellow);
}

function receiveServerInfo(data){
	log('Robot(J)s server says : ' + data.msg.green + '\n');
	launch();
}

function disconnect(){
	log('Disconnected'.red);
}

function log(msg){
	console.log('[' + moment().format() + '] ' + msg);
}

function executeCommand(command){
	console.log(command);
	socket.emit('move', {direction: 'forward'}, function(data){
		var bot = robotService.create(data.bot);
		console.log(bot.name + ' moved !');
	});
	socket.emit('turn', {direction: 'right'}, function(data){
		var bot = robotService.create(data.bot);
		console.log(bot.name + ' moved !');
	});
	socket.emit('move', {direction: 'forward'}, function(data){
		var bot = robotService.create(data.bot);
		console.log(bot.name + ' moved !');
	});
	socket.emit('turn', {direction: 'left'}, function(data){
		var bot = robotService.create(data.bot);
		console.log(bot.name + ' moved !');
	});
}
