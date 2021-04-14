let http = require("http");
let DiscordRPC = require("discord-rpc");
let rpc = new DiscordRPC.Client({ transport: "ipc" });
let port = 52337;
let iconEnabled = false;
let clientId = "830659695047213067";

function setActivity(details, state) {
	let startTimestamp = new Date();
	let activity = { startTimestamp };
	if (details) activity.details = details;
	if (state) {
		activity.state = state;
		if (iconEnabled) {
			let iconKey = state.replace(/[^a-zA-Z0-9 ]/g, "").replace(/ /g, "_").toLowerCase();
			activity.largeImageKey = iconKey;
			activity.largeImageText = '  ';
			activity.smallImageKey = 'rblxicon';
		}
		else activity.largeImageKey = 'rblxicon';
	}
	else activity.largeImageKey = 'rblxicon';
	activity.instance = false;
	rpc.setActivity(activity).catch(console.error);
};

http.createServer((req, res) => {
	let body = [];
	req.on('data', (chunk) => {
		body.push(chunk);
	}).on('end', () => {
		body = Buffer.concat(body).toString();
		let activityInfo = body.split(/[,]/g);
		setActivity(...activityInfo);
		console.log("Activity updated successfully")
		res.end();
	});
}).listen(port, () => { console.log("Listening on port " + port) });

rpc.login({ clientId }).catch(console.error).then(() => { setActivity("Waiting for roblox studio...") });
