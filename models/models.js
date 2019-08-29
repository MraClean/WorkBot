const mongoose = require("mongoose")

const user = new mongoose.Schema({
	id: String,
	token: String,
	teams: Array,
	tasks: Array,
	requests: Array
})

const guild = new mongoose.Schema({
	id: String,
	prefix: String,
	disabled: Array
})

const team = new mongoose.Schema({
	id: String,
	name: String,
	token: String,
	members: Array,
	pendingMembers:Array,
	tasks: Array,
	type: Number
})

module.exports = {
	'User':mongoose.model('User',user),
	'Guild':mongoose.model('Guild',guild),
	'Team':mongoose.model('Team',team)
}