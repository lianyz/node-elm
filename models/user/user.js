'use strict';

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	loginname: String,
	password: String,
	username: String,
	phone: String,
	unit: String,
	id: Number,
	create_time: String,
});

userSchema.index({ id: 1 });
userSchema.index({ loginname: 1});

const User = mongoose.model('AdminUser', userSchema);

export default User