
import settings from './settings';
import connectToMongoDb from './config/database.config';
import logger from './config/logger.config';
import apiRouters from './router';
import TodoService from "./modules/Todo/todo.service";
import EmailService from "./modules/commonservices/email.service"
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from 'morgan';
import schedule from 'node-schedule'
import http from 'http';
const fileUpload = require('express-fileupload');
let config = require('./config/' + settings.environment + '.config');
var mkdirp = require('mkdirp');
import _ from "lodash";

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

//set the port
const port = settings.port;

const app = express();

const server = http.createServer(app)

connectToMongoDb();

app.use(cors());
app.use(bodyParser.json({ extended: true, limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app.use(fileUpload());
app.use(morgan("dev", { "stream": logger.stream }));

if (!config.default.media.useS3) {

    mkdirp(config.default.media.local_file_path, function (err) {
        if (err) {
            console.log("****************************************************************************")
            console.log("*********************Run the Application in Root Mode **********************")
            console.log("*************Or Make sure the folder has permission to run it*******")
            console.log("*********************This is for mainitiang media files*********************")
            console.log("****************************************************************************")
            console.error(err)
        }
        else console.log('Media File Path exists: ' + config.default.media.local_file_path)
    });

    app.use('/static', express.static(config.default.media.local_file_path))
}

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

//healthcheck 
app.get('/health_check', function (req, res, next) {
    res.sendStatus(200);
});

// include all the necessary routes in the express
apiRouters.forEach(function (apiRoute) {
    app.use('/api', apiRoute);
});

//for every 1 hour it will be..
var j = schedule.scheduleJob('* */1 * * *', async () => {
    console.log('The email remainder started!');
    let listtodo = await TodoService.findalltodo();
    let from = "noreply@gmail.com"
    let subject = "Task Reminder"
    let text = "Complete The Task ASAP!!!"
    listtodo.forEach(element => {
        EmailService.SendEmail(from, element.email, subject, text)
    });
});


server.listen(port, () => {
    logger.info(`Server started on port : ${port}`);
});