'use strict';

import express from 'express'
import Admin from '../controller/admin/admin'
import Check from '../middlewares/check'

import User from '../controller/user/user'
import Well from '../controller/well/well'

const router = express.Router()

router.post('/login', Admin.login);
// router.post('/register', Admin.register);

router.get('/singout', Admin.singout);
router.get('/all', Admin.getAllAdmin);
router.get('/count', Admin.getAdminCount);
router.get('/info', Admin.getAdminInfo);
router.post('/update/avatar/:admin_id', Admin.updateAvatar);

router.post('/addUser', Check.checkAdmin, User.addUser);
router.get('/userlist', User.getUserList);
router.get('/usercount', User.getUserCount);
router.post('/updateuser', Check.checkAdmin, User.updateUser);
router.delete('/deleteuser/:user_id', Check.checkAdmin, User.deleteUser);
router.get('/wellCountOfUser', User.getWellCountOfUser);
router.get('/wellListOfUser', User.getWellListOfUser);
router.get('/wellCountOfNotUser', User.getWellCountOfNotUser);
router.get('/wellListOfNotUser', User.getWellListOfNotUser);
router.post('/addWellToUser', User.addWellToUser);
router.post('/removeWellFromUser', User.removeWellFromUser);


router.post('/addWell', Check.checkAdmin, Well.addWell);
router.get('/welllist', Well.getWellList);
router.get('/wellcount', Well.getWellCount);
router.post('/updatewell', Check.checkAdmin, Well.updateWell);
router.delete('/deletewell/:well_id', Check.checkAdmin, Well.deleteWell);

export default router