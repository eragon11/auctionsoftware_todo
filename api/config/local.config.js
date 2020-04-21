import path from 'path';

let config = {
    web_end_point: "http://localhost:4200",
    api_end_point: "http://localhost:8082",
    mongo: {
        database_name: "xdatabase",
        host: "xhost",
        port: "xport",
        username: "xname",
        password: "xpassword"
    },
    logs: {
        path: path.join(__dirname, '../logs'),
        file_name: 'local.ServiceApp.logs'
    },
    email: {
        service: 'gmail',
        auth: {
            user: 'xemail',
            pass: 'xpass'
        }
    },
    media: {
        local_file_path: "/home/todo/",
        useS3: false
    }
};

export default config;
