var Git = require('gift')
var url = require("url")
var qs = require("querystring")
var connect = require("connect")
var getGit = function(query){
  var git = new Git("./"); //TODO:opt
  if(query){
    var queries = qs.parse(query);
    if(queries.repo){
      git = new Git(queries.repo);
    }
  }
  return git
}


exports = module.exports = function(options){
  var routerPrefix = "git"
  
  return function gitJson(req, res, next) {
    var matcher = new RegExp(routerPrefix+"/(.*)")
    var parsedUrl = url.parse(req.url);
    if(!matcher.test(parsedUrl.pathname)){
      next()
      return;
    }
    var git = getGit(parsedUrl.query);
    
    
    var matches = parsedUrl.pathname.match(matcher)[1].split("/");
    var gitFuncName = matches.shift();
    var gitFunc = git[gitFuncName]
    var args = matches
    if(typeof gitFunc  != "function"){
      next()
      return;
    }
    
    var callback = function(err, result){
      var json = JSON.stringify(result)
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.write(json);
      res.end()
    }
    
    // set default params as null
    if(args.length < 1){
      var argNum = gitFunc.length - 1;
      for(var i=0; i < argNum; i++){
        args.push(null)
      }
    }
    var apply = [];
    if(args.length > 0){
      args.forEach(function(arg){
        apply.push(arg);
      })
    }
    apply.push(callback)
    try{
      gitFunc.apply(git, apply)
    }catch(e){
      next()
    }
    
  }
}
