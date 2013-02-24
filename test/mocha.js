process.env.CONNECT_COV = 0
var connect = require("connect")
var gitJson = require("../");

var request = require('supertest');

var nonArgsFunctions = [
  'commits',
  //'tree', //err
  'diff',
  'remotes',
  'remote_list',
  'status',
  'tags',
  'branches',
  'branche', //err
]
var argsFunc = [
  'remote_add',
  'remote_fetch',
  'create_tag',
  'delete_tag',
  'create_branch',
  'delete_branch',
  'commit',
  'add',
  'remove',
  'checkout',
]

var app = require("./app")("./test/fixture");
//request = request(app);
describe('[Connect-git-json]', function () {
  nonArgsFunctions.forEach(function(func){
    it('No args test:'+ func, function (done) {
      request(app)
        .get("/git/"+func)
        .expect(200)
        .end(function(err, res){
          if (err) {
            return done(err);
          }
          done()
        })
    })
  });
});