'use strict';

import UserModel from '../../models/user/user'
import WellModel from '../../models/well/well'

import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class User extends BaseComponent{
	constructor(){
		super()
		this.addUser = this.addUser.bind(this);
	}
	//添加用户
	async addUser(req, res, next){
		let user_id;
		try{
			user_id = await this.getId('user_id');
		}catch(err){
			console.log('获取用户id失败');
			res.send({
				type: 'ERROR_DATA',
				message: '获取数据失败'
			})
			return
		}
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			try{
				if (!fields.loginname) {
					throw new Error('必须填写登陆名');
				}else if(!fields.password){
					throw new Error('必须填写登陆密码');
				}else if(!fields.username){
					throw new Error('必须填写用户姓名');
				}else if(!fields.phone){
					throw new Error('必须填写联系电话');
				}else if(!fields.unit){
					throw new Error('必须填写所属单位');
				}else if(!fields.image_path){
					throw new Error('必须上传照片');
				}
			}catch(err){
				console.log('前台参数出错', err.message);
				res.send({
					status: 0,
					type: 'ERROR_PARAMS',
					message: err.message
				})
				return
			}
			const newUser = {
				loginname: fields.loginname,
				password: fields.password,
				username: fields.username,
				phone: fields.phone,
				unit: fields.unit,
				id: user_id,
				create_time: dtime().format('YYYY-MM-DD HH:mm'),
			}

			try{
				const user = new UserModel(newUser);
				await user.save();
				res.send({
					status: 1,
					sussess: '添加用户成功',
					userDetail: newUser
				})
			}catch(err){
				console.log('用户写入数据库失败: ' + err);
				res.send({
					status: 0,
					type: 'ERROR_SERVER',
					message: '添加用户失败',
				})
			}
		})
	}

	async getUserList(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const users = await UserModel.find({}, '-_id').sort({user_id: -1}).limit(Number(limit)).skip(Number(offset));
			res.send(users);
		}catch(err){
			console.log('获取用户列表数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取用户列表数据失败'
			})
		}
	}

	async getWellCountOfUser(req, res, next){
		const { user_id } = req.query;
		try{
			console.log('user_id: ' + user_id)
			const count = await UserModel.wellCountOfUser(user_id);
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取用户管理的油井数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_TO_GET_USER_COUNT',
				message: '获取用户管理的油井数量失败'
			})
		}
	}

	async getWellCountOfNotUser(req, res, next){
		const { user_id } = req.query;
		try{
			const user = await UserModel.findOne({id: user_id})
			const count = await WellModel.find( {id: {$nin: user.wells}} ).count();
			// console.log('well_count: ' + count)

			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取非该用户管理的油井数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_TO_GET_USER_COUNT',
				message: '获取非该用户管理的油井数量失败'
			})
		}
	}

	async addWellToUser(req, res, next) {

        const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.log('获取信息出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return 
			}

			const { well_id, user_id } = fields;
			try{
				const result = await UserModel.addWellToUser(well_id, user_id);
				res.send({
					status: 1,
					result,
				})
			}catch(err){
				console.log('添加油井至用户失败', err);
				res.send({
					status: 0,
					type: 'ERROR_TO_ADD_WELL_TO_USER',
					message: '添加油井至用户失败'
				})
			}

		})
	}

	async removeWellFromUser(req, res, next) {

        const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.log('获取信息出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return 
			}

			const { well_id, user_id } = fields;
			try{
				const result = await UserModel.removeWellFromUser(well_id, user_id);
				res.send({
					status: 1,
					result,
				})
			}catch(err){
				console.log('将油井从用户中移出失败', err);
				res.send({
					status: 0,
					type: 'ERROR_TO_REMOVE_WELL_FROM_USER',
					message: '将油井从用户中移出失败'
				})
			}

		})
	}

	async getWellListOfUser(req, res, next){
		const { user_id } = req.query;
		try{
			const user = await UserModel.findOne({id: user_id})
			const wells = await WellModel.find( {id: {$in: user.wells}} );

			res.send(wells);
		}catch(err){
			console.log('获取用户管理的油井列表失败', err);
			res.send({
				status: 0,
				type: 'ERROR_TO_GET_USER_COUNT',
				message: '获取用户管理的油井列表失败'
			})
		}
	}

	async getWellListOfNotUser(req, res, next){
		const { user_id } = req.query;
		try{
			const user = await UserModel.findOne({id: user_id})
			const wells = await WellModel.find( {id: {$nin: user.wells}} );

            console.log('获取到的油井：');
			// console.dir(wells);

			res.send(wells);
		}catch(err){
			console.log('获取非该用户管理的油井列表失败', err);
			res.send({
				status: 0,
				type: 'ERROR_TO_GET_USER_COUNT',
				message: '获取非该用户管理的油井列表失败'
			})
		}
	}

	async getUserCount(req, res, next){
		try{
			const count = await UserModel.count();
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取用户数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_TO_GET_USER_COUNT',
				message: '获取用户数量失败'
			})
		}
	}

    // 更新用户信息
	async updateUser(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.log('获取用户信息form出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return 
			}

			console.dir(fields);

			const {loginname, password, username, phone, unit, id} = fields;

			try{
				if (!loginname) {
					throw new Error('登录名称错误');
				}else if(!password){
					throw new Error('登录密码错误');
				}else if(!username){
					throw new Error('用户姓名错误');
				}else if(!phone){
					throw new Error('用户电话错误');
				}else if(!unit){
					throw new Error('所属单位错误');
				}else if(!id || !Number(id)){
					throw new Error('用户ID错误');
				}
				let newData;
				newData = {loginname, password, username, phone, unit, id}
	
				await UserModel.findOneAndUpdate({id}, {$set: newData});
				res.send({
					status: 1,
					success: '修改用户信息成功',
				})
			}catch(err){
				console.log(err.message, err);
				console.dir(newData);
				res.send({
					status: 0,
					type: 'ERROR_UPDATE_RESTAURANT',
					message: '更新用户信息失败',
				})
			}
		})
	}

	async deleteUser(req, res, next){
		const user_id = req.params.user_id;
		if (!user_id || !Number(user_id)) {
			console.log('user_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'user_id参数错误',
			})
			return 
		}
		try{
			await UserModel.remove({id: user_id});
			res.send({
				status: 1,
				success: '删除用户成功',
			})
		}catch(err){
			console.log('删除用户失败', err);
			res.send({
				status: 0,
				type: 'DELETE_USER_FAILED',
				message: '删除用户失败',
			})
		}
	}

	//获取餐馆列表
	async getRestaurants(req, res, next){
		const {
			latitude,
			longitude,
			offset = 0,
			limit = 20,
			keyword,
			restaurant_category_id,
			order_by,
			extras,
			delivery_mode = [],
			support_ids = [],
			restaurant_category_ids = [],
		} = req.query;

		try{
			if (!latitude) {
				throw new Error('latitude参数错误')
			}else if(!longitude){
				throw new Error('longitude参数错误');
			}
		}catch(err){
			console.log('latitude,longitude参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: err.message
			})
			return
		}
		let filter = {};
		//获取对应食品种类
		if (restaurant_category_ids.length && Number(restaurant_category_ids[0])) {
			const category =  await CategoryHandle.findById(restaurant_category_ids[0]);
			Object.assign(filter, {category})
		}
		//按照距离，评分，销量等排序
		let sortBy = {};
		if (Number(order_by)) {
			switch(Number(order_by)){
				case 1:
					Object.assign(sortBy, {float_minimum_order_amount: 1});
					break;
				case 2:
					Object.assign(filter, {location: {$near: [longitude, latitude]}});
					break;
				case 3:
					Object.assign(sortBy, {rating: -1});
					break;
				case 5:
					Object.assign(filter, {location: {$near: [longitude, latitude]}});
					break;
				case 6:
					Object.assign(sortBy, {recent_order_num: -1});
					break;
			}
		}
		//查找配送方式
		if (delivery_mode.length) {
			delivery_mode.forEach(item => {
				if (Number(item)) {
					Object.assign(filter, {'delivery_mode.id': Number(item)})
				}
			})
		}
		//查找活动支持方式
		if (support_ids.length) {
			const filterArr = []; 
			support_ids.forEach(item => {
				if (Number(item) && (Number(item) !== 8)) {
					filterArr.push(Number(item))
				}else if(Number(item) == 8){ //品牌保证特殊处理
					Object.assign(filter, {is_premium: true})
				}
			})
			if (filterArr.length) {
				//匹配同时拥有多种活动的数据
				Object.assign(filter, {'supports.id': {$all: filterArr}})
			}
		}

		const restaurants = await ShopModel.find(filter, '-_id').sort(sortBy).limit(Number(limit)).skip(Number(offset))
		const from = latitude + ',' + longitude;
		let to = '';
		//获取百度地图测局所需经度纬度
		restaurants.forEach((item, index) => {
			const slpitStr = (index == restaurants.length -1) ? '' : '|';
			to += item.latitude + ',' + item.longitude + slpitStr;
		})
		try{
			if (restaurants.length) {
				//获取距离信息，并合并到数据中
				const distance_duration = await this.getDistance(from, to)
				restaurants.map((item, index) => {
					return Object.assign(item, distance_duration[index])
				})
			}
		}catch(err){
			console.log('从addressComoponent获取测距数据失败', err);
			restaurants.map((item, index) => {
				return Object.assign(item, {distance: '10公里', order_lead_time: '40分钟'})
			})
		}
		try{
			res.send(restaurants)
		}catch(err){
			res.send({
				status: 0,
				type: 'ERROR_GET_SHOP_LIST',
				message: '获取店铺列表数据失败'
			})
		}
	}
	//搜索餐馆
	async searchResaturant(req, res, next){
		const {geohash, keyword} = req.query;
		try{
			if (!geohash || geohash.indexOf(',') == -1) {
				throw new Error('经纬度参数错误');
			}else if(!keyword){
				throw new Error('关键词参数错误');
			}
		}catch(err){
			console.log('搜索商铺参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: err.message,
			})
			return
		}
		
		try{
			const restaurants = await ShopModel.find({name: eval('/' + keyword + '/gi')}, '-_id').limit(50);
			if (restaurants.length) {
				const [latitude, longitude] = geohash.split(',');
				const from = latitude + ',' + longitude;
				let to = '';
				//获取百度地图测局所需经度纬度
				restaurants.forEach((item, index) => {
					const slpitStr = (index == restaurants.length -1) ? '' : '|';
					to += item.latitude + ',' + item.longitude + slpitStr;
				})
				//获取距离信息，并合并到数据中
				const distance_duration = await this.getDistance(from, to)
				restaurants.map((item, index) => {
					return Object.assign(item, distance_duration[index])
				})
			}
			res.send(restaurants);
		}catch(err){
			console.log('搜索餐馆数据失败');
			res.send({
				status: 0,
				type: 'ERROR_DATA',
				message: '搜索餐馆数据失败'
			})
		}
	}
	//获取餐馆详情
	async getRestaurantDetail(req, res, next){
		const restaurant_id = req.params.restaurant_id;
		if (!restaurant_id || !Number(restaurant_id)) {
			console.log('获取餐馆详情参数ID错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: '餐馆ID参数错误',
			})
			return
		}
		try{
			const restaurant = await ShopModel.findOne({id: restaurant_id}, '-_id');
			res.send(restaurant)
		}catch(err){
			console.log('获取餐馆详情失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取餐馆详情失败'
			})
		}
	}
	async getShopCount(req, res, next){
		try{
			const count = await ShopModel.count();
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取餐馆数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_TO_GET_COUNT',
				message: '获取餐馆数量失败'
			})
		}
	}
	async updateshop(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.log('获取商铺信息form出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return 
			}
			const {name, address, description = "", phone, category, id, latitude, longitude, image_path} = fields;
			if (id == 1) {
				res.send({
					status: 0,
					message: '此店铺用做展示，请不要修改'
				})
				return
			}
			try{
				if (!name) {
					throw new Error('餐馆名称错误');
				}else if(!address){
					throw new Error('餐馆地址错误');
				}else if(!phone){
					throw new Error('餐馆联系电话错误');
				}else if(!category){
					throw new Error('餐馆分类错误');
				}else if(!id || !Number(id)){
					throw new Error('餐馆ID错误');
				}else if(!image_path){
					throw new Error('餐馆图片地址错误');
				}
				let newData;
				if (latitude && longitude) {
					newData = {name, address, description, phone, category, latitude, longitude, image_path}
				}else{
					newData = {name, address, description, phone, category, image_path}
				}
				await ShopModel.findOneAndUpdate({id}, {$set: newData});
				res.send({
					status: 1,
					success: '修改商铺信息成功',
				})
			}catch(err){
				console.log(err.message, err);
				res.send({
					status: 0,
					type: 'ERROR_UPDATE_RESTAURANT',
					message: '更新商铺信息失败',
				})
			}
		})
	}
	async deleteResturant(req, res, next){
		const restaurant_id = req.params.restaurant_id;
		if (!restaurant_id || !Number(restaurant_id)) {
			console.log('restaurant_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'restaurant_id参数错误',
			})
			return 
		}
		try{
			await ShopModel.remove({id: restaurant_id});
			res.send({
				status: 1,
				success: '删除餐馆成功',
			})
		}catch(err){
			console.log('删除餐馆失败', err);
			res.send({
				status: 0,
				type: 'DELETE_RESTURANT_FAILED',
				message: '删除餐馆失败',
			})
		}
	}
}

export default new User()