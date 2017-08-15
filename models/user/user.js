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
	wells: { type:[Number] },
});

userSchema.index({ id: 1 });
userSchema.index({ loginname: 1});

userSchema.statics.wellCountOfUser = function(user_id){
	return new Promise(async (resolve, reject) => {
		try{
			const user = await this.findOne({id: user_id})
			console.log('油井个数: ' + user.wells.length)
			resolve(user.wells.length)
		}catch(err){
			reject({
				name: 'ERROR_DATA',
				message: '查找数据失败',
			});
			console.error(err);
		}
	})
}


userSchema.statics.addWellToUser = function(well_id, user_id){
	return new Promise(async (resolve, reject) => {
		try{
			console.log('addWellToUser: ' + well_id + ' ' + user_id)

			await this.findOneAndUpdate({ id: user_id }, {$addToSet: {wells: well_id}});
			resolve(1)
			// const city = await this.findOne();
			// Object.entries(city.data).forEach(item => {
			// 	if(item[0] !== '_id' && item[0] !== 'hotCities'){
			// 		item[1].forEach(cityItem => {
			// 			if (cityItem.id == id) {
			// 				resolve(cityItem)
			// 			}
			// 		})
			// 	}
			// })
		}catch(err){
			reject({
				name: 'ERROR_DATA',
				message: '查找数据失败',
			});
			console.error(err);
		}
	})
}

userSchema.statics.removeWellFromUser = function(well_id, user_id){
	return new Promise(async (resolve, reject) => {
		try{
			console.log('removeWellFromUser: ' + well_id + ' ' + user_id)

			await this.findOneAndUpdate({ id: user_id }, {$pull: {wells: well_id}});
			resolve(1)
		}catch(err){
			reject({
				name: 'ERROR_DATA',
				message: '查找数据失败',
			});
			console.error(err);
		}
	})
}

userSchema.statics.wellListOfUser = function(user_id){
	return new Promise(async (resolve, reject) => {
		try{
			console.log('wellListOfUser')
			const user = await this.findOne({id: user_id})
			const wells = await WellModel.find( {id: {$in: user.wells}} );
			resolve(wells)
		}catch(err){
			reject({
				name: 'ERROR_DATA',
				message: '查找数据失败',
			});
			console.error(err);
		}
	})
}
const User = mongoose.model('AdminUser', userSchema);

export default User