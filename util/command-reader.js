module.exports = CommandReader;

function CommandReader(){}

CommandReader.prototype.execute = function(command, socket){
	var splitted = command.split(' ');

	var error = null;
	var client = null;
	if (splitted.length > 1){
		var serviceName = splitted[0].substring(0, 1).toUpperCase() + splitted[0].substring(1).toLowerCase() + 'Client';

		try {
			var clientClass = require('../client/' + splitted[0]);
			client = new clientClass();
			client.setSocket(socket);

			try{
				if (splitted.length > 5)
					result = client[splitted[1]](splitted[2], splitted[3], splitted[4], splitted[5]);
				else if (splitted.length > 4)
					result = client[splitted[1]](splitted[2], splitted[3], splitted[4]);
				else if (splitted.length > 3)
					result = client[splitted[1]](splitted[2], splitted[3]);
				else if (splitted.length > 2)
					result = client[splitted[1]](splitted[2]);
				else
					result  = client[splitted[1]]();
			}
			catch(e){
				error = 'Method ' + splitted[1].yellow + ' does not exists for ' + splitted[0].yellow + ' client';
				error += '\nmessage : ' + e.message.red;
			}
		}
		catch(e){
			error = 'Service ' + splitted[0].yellow + ' does not exists';
			error += '\nmessage : ' + e.message.red;
		}

	}
	else if (command.length > 0) error = 'Missing parameters for ' + splitted[0].yellow;

	return {client: client, error: error};
};


