'use strict';

var shelljs = require('shelljs');
var path = require('path');
var fs = require('fs');
var lockfile = require('proper-lockfile');
var Promise = require('bluebird');
var lockAsync = Promise.promisify(lockfile.lock);
var writeFileAsync = Promise.promisify(fs.writeFile);
var shellExecAsync = Promise.promisify(shelljs.exec);

module.exports = function (which, cb) {
    var prelease, outfile, shellErr, fileErr, releaseErr;
    lockAsync('./lock/', {retries: 10, stale: 2000}, function (err) {
        console.log('this one');
        console.error(err);
    }).
        then(function (release) {
            prelease = Promise.promisify(release);
            shelljs.env['TURK'] = 'foo' + which;
            return shellExecAsync(path.resolve(__dirname, 'shell.sh')).
                catch(function (err) {
                    console.error('caught', err);
                    shellErr = err;
                });
        }).
        then(function (output) {
            var datestamp = Date.now();
            outfile = path.resolve(__dirname, 'foo/foo.' + datestamp + '.txt');
            return writeFileAsync(outfile, output).
                catch(function (err) {
                    console.error('caught', err);
                    fileErr = err;
                });
        }).
        then(function () {
            return prelease().
                catch(function (err) {
                    console.error('caught', err);
                    releaseErr = err;
                });
        }).
        then(function () {
            if (shellErr || fileErr || releaseErr) {
                return cb(shellErr || fileErr || releaseErr);
            }
            cb(null, 'wrote to ' + outfile);
        }).
        catch(function (err) {
            console.error(err);
        });
};