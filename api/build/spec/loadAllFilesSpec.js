'use strict';


const rewire = require('rewire');
const fs = require('fs');
const path = require('path');
// List all files in a directory in Node.js recursively in a synchronous fashion
const getJsFiles = function (dir, filelist) {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = getJsFiles(dir + '/' + file, filelist);
        } else if (path.extname(file) === '.js') {
            filelist.push(dir + '/' + file);
        }
    });
    return filelist;
};

describe('load all js files to get coverage', function () {
    const allJsFiles = getJsFiles(path.normalize(__dirname + '/../lib'));
    const connect = rewire('../lib/db/connect');
    const mysql = connect.__get__('mysql');
    const logger = connect.__get__('logger');
    const createConnectionOrig = mysql.createConnection;
    const loggerInfoOrig = logger.info;

    beforeEach(function () {
        mysql.createConnection = function () {
            return {
                connect: () => {},
                query: () => {},
            };
        };

        logger.info = () => {};
    });

    afterEach(function () {
        mysql.createConnection = createConnectionOrig;
        logger.info = loggerInfoOrig;
    });

    it('should load all files', function () {
        allJsFiles.forEach(function (file) {
            require(file);
        });
    });
});
