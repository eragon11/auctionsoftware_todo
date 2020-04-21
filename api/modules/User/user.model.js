import mongoose from 'mongoose';
var uuidv1 = require('uuid/v1');
import mongoosePaginate from 'mongoose-paginate';
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    city: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'in_active', 'supended'],
        default: "active"
    },
    gender: {
        type: String
    },
    is_admin: {
        type: Boolean,
        default: false
    },
}, { collection: 'Employee', timestamps: true });
UserSchema.plugin(mongoosePaginate);
let UserModel = mongoose.model('Employee', UserSchema);

export default UserModel