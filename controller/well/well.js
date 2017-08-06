'use strict';

import WellModel from '../../models/well/well'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Well extends BaseComponent{
	constructor(){
		super()
		this.addWell = this.addWell.bind(this);
	}

	//添加油井
	async addWell(req, res, next){
		let well_id;
		try{
			well_id = await this.getId('well_id');
		}catch(err){
			console.log('获取油井id失败');
			res.send({
				type: 'ERROR_DATA',
				message: '获取数据失败'
			})
			return
		}

		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			try{
				if (!fields.well_name) {
					throw new Error('必须填写油井名称');
				}else if(!fields.rtu_number){
					throw new Error('必须填写RTU编号');
				}else if(!fields.work_crew){
					throw new Error('必须填写所属工作队');
				}else if(!fields.work_zone){
					throw new Error('必须填写所属工作区');
				}else if(!fields.work_field){
					throw new Error('必须填写所属场别');
				}else if(!fields.oil_field){
					throw new Error('必须填写所属油田');
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

			console.dir(fields)

			const newWell = {
				create_time: dtime().format('YYYY-MM-DD HH:mm'),
				well_name: fields.well_name,
				well_longitude: fields.well_longitude,
				well_latitude: fields.well_latitude,
				rtu_number: fields.rtu_number,
				work_crew: fields.work_crew,
				work_zone: fields.work_zone,
				work_field: fields.work_field,
				oil_field: fields.oil_field,
				id: well_id,
			}

			try{
				const well = new WellModel(newWell);
				await well.save();
				res.send({
					status: 1,
					sussess: '添加油井成功',
					wellDetail: newWell
				})
			}catch(err){
				console.log('用户写入数据库失败: ' + err);
				res.send({
					status: 0,
					type: 'ERROR_SERVER',
					message: '添加油井失败',
				})
			}
		})
	}

	async getWellList(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const wells = await WellModel.find({}, '-_id').sort({well_id: -1}).limit(Number(limit)).skip(Number(offset));
			res.send(wells);
		}catch(err){
			console.log('获取油井列表数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取油井列表数据失败'
			})
		}
	}
	async getWellCount(req, res, next){
		try{
			const count = await WellModel.count();
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取油井数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_TO_GET_WELL_COUNT',
				message: '获取油井数量失败'
			})
		}
	}

    // 更新油井信息
	async updateWell(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.log('获取油井信息form出错', err);
				res.send({
					status: 0,
					type: 'ERROR_FORM',
					message: '表单信息错误',
				})
				return 
			}

			console.dir(fields);

				// create_time: dtime().format('YYYY-MM-DD HH:mm'),
				// well_name: fields.well_name,
				// well_longitude: fields.longitude,
				// well_latitude: fields.latitude,
				// rtu_number: fields.rtu_number,
				// work_crew: fields.work_crew,
				// work_zone: fields.work_zone,
				// work_field: fields.work_field,
				// oil_field: fields.oil_field,
				// id: well_id,

			const {well_name, well_longitude, well_latitude, rtu_number, 
				   work_crew, work_zone, work_field, oil_field, id} = fields;

			try{
				if (!well_name) {
					throw new Error('油井名称错误');
				}else if(!rtu_number){
					throw new Error('RTU编号错误');
				}else if(!work_crew){
					throw new Error('所属工作队错误');
				}else if(!work_zone){
					throw new Error('所属工作区错误');
				}else if(!work_field){
					throw new Error('所属场别错误');
				}else if(!id || !Number(id)){
					throw new Error('油井ID错误');
				}
				let newData;
				newData = {well_name, well_longitude, well_latitude, rtu_number, 
				   work_crew, work_zone, work_field, oil_field, id}
	
				await WellModel.findOneAndUpdate({id}, {$set: newData});
				res.send({
					status: 1,
					success: '修改油井信息成功',
				})
			}catch(err){
				console.log(err.message, err);
				console.dir(newData);
				res.send({
					status: 0,
					type: 'ERROR_UPDATE_WELL',
					message: '更新油井信息失败',
				})
			}
		})
	}

	async deleteWell(req, res, next){
		const well_id = req.params.well_id;
		if (!well_id || !Number(well_id)) {
			console.log('well_id参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: 'well_id参数错误',
			})
			return 
		}
		try{
			await WellModel.remove({id: well_id});
			res.send({
				status: 1,
				success: '删除油井成功',
			})
		}catch(err){
			console.log('删除油井失败', err);
			res.send({
				status: 0,
				type: 'DELETE_WELL_FAILED',
				message: '删除油井失败',
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

export default new Well()