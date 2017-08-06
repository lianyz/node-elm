'use strict';

import mongoose from 'mongoose'

const wellSchema = new mongoose.Schema({
	id: Number,
	create_time: String,
	well_name: String,
	well_longitude: Number,
	well_latitude: Number,
	rtu_number: String,
	work_crew: String,
	work_zone: String,
	work_field: String,
	oil_field: String,
});

wellSchema.index({ id: 1 });
wellSchema.index({ loginname: 1});

const Well = mongoose.model('Well', wellSchema);

export default Well