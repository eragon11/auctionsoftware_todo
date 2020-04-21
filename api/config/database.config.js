import Mongoose from 'mongoose';
import settings from '../settings';
import logger from './logger.config';

let config = require('./' + settings.environment + '.config');

Mongoose.Promise = global.Promise;

const connectToMongoDb = async () => {
    let host = config.default.mongo.host;
    let port = config.default.mongo.port;
    let username = config.default.mongo.username;
    let password = config.default.mongo.password;
    let database_name = config.default.mongo.database_name;
    let connectionString = "";

    if (settings.environment === "local") {
        // connectionString = `mongodb://${host}:${port}/${database_name}`;
        connectionString = `mongodb+srv://${username}:${password}@cluster0-kysrb.mongodb.net/${database_name}?retryWrites=true&w=majority`
    }
    
    try {
        await Mongoose.connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true });
        logger.info(`MongoDB Connected to ${database_name}`);

    } catch (error) {
        console.log(error);
        
        logger.error(`Error Connecting to MongoDB  ${database_name}`);
    }

};

export default connectToMongoDb;    