module.exports = function(repo, dev){
  var connect = require("connect")
  var gitJson = require("../");
  var app = connect();
  app.use(connect.favicon())
  if(dev){
    app.use(connect.logger("dev"))
  }
  repo = repo || "./test/fixture"
  app.use(gitJson({
    gitRepo : repo
  }));
  return app;
}