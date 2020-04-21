import mongoose from 'mongoose';
var uuidv1 = require('uuid/v1');
import mongoosePaginate from 'mongoose-paginate';
const TodoSchema = mongoose.Schema({
    task_name: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['completed', 'in-progress', 'not-started'],
        default: "not-started"
    },
    expiry: {
        type: Date,
        default: Date.now()
    },
}, { collection: 'Todo', timestamps: true });
TodoSchema.plugin(mongoosePaginate);
let TodoModel = mongoose.model('Todo', TodoSchema);

export default TodoModel