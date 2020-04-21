import User from "../User/user.model";
import sha256 from "sha256";
var uuidv1 = require('uuid/v1');
import _ from 'lodash';

const UserService = {};

  UserService.getAllUser = async (searchkey, status, user_id) => {
    try {
  
      if (searchkey) {
        var users = await User.find({ "name": { "$regex": searchkey, "$options": "i" }, "_id": { '$ne': user_id, }, "status": status }, { _id: 1, name: 1, email: 1 }).lean();
        return users;
  
      } else {
        var users = await User.find({ "_id": { '$ne': user_id, }, "status": status },
          { _id: 1, name: 1, email: 1 }).lean();
        return users;
  
      }
    } catch (error) {
      throw error;
    }
  };

  UserService.getUserAdd = async (data) => {
    try {
      console.log("new employee add")
      let userToAdd = new User(data);
      const savedUser = await userToAdd.save();
      return savedUser;
    } catch (error) {
      throw error
    }
  }

  UserService.addUser = async user => {
    try {
      user.password = await sha256(user.password);
      let userToAdd = new User(user);
      const savedUser = await userToAdd.save();
      console.log(savedUser);
      
      return savedUser;
    } catch (error) {
      throw error;
    }
  };

  UserService.getUserEdit = async (data) => {
    try {
      const savedUser = await User.findByIdAndUpdate(data._id, data, { upsert: true, new: true });
      return savedUser;
    } catch (error) {
      throw error
    }
  };

  UserService.getUserDelete = async (id) => {
    try {
      const savedUser = await User.findByIdAndUpdate(id, { "status": "in_active" });
      return savedUser;
    } catch (error) {
      throw error
    }
  }

  UserService.getUserByEmailId = async EmailId => {
    try {
      const user = await User.findOne({ email: new RegExp("^" + EmailId + "$", "i") });
      return user;
    } catch (error) {
      throw error;
    }
  };

  UserService.getUserByUserId = async user_id => {
    try {
      const user = await User.findOne({ _id: Object(user_id) }).lean();
      return user;
    } catch (error) {
      throw error;
    }
  };

  UserService.updateUserById = async (user_id, data) => {
    try {
      const updatedUser = await User.findOneAndUpdate({ _id: user_id }, data, {
        strict: true,
        new: true
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };


export default UserService;  