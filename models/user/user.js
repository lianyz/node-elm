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

userSchema.statics.wellCountOfUser = function(user_id){
	return new Promise(async (resolve, reject) => {
		try{
			resolve(0)
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


userSchema.statics.wellListOfUser = function(user_id){
	return new Promise(async (resolve, reject) => {
		try{
			resolve()
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
const User = mongoose.model('AdminUser', userSchema);

export default User