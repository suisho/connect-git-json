var Git = require('gift')
var url = require("url")
var qs = require("querystring")
var connect = require("connect")
exports = module.exports = function(options){
  var routerPrefix = "git"
  //
  var gitRepo = options.gitRepo
  
  
  this.createGit = function(repo){
    var git = new Git(gitRepo);
    if(repo){
      git = new Git(repo);
    }
    return git
  }
  
  
  this.createArgs = function(func, params){
    
    var argsName = argumentNames(func)
    var args = [];
    // set default params as null
    argsName.forEach(function(arg, i){
      if(params[arg]){
        args[i] = params[arg]
      }else{
        args[i] = null;
      }
    })
    return args;
  }
  
  return function gitJson(req, res, next) {
    var matcher = new RegExp(routerPrefix+"/(.*)")
    
    var parsedUrl = url.parse(req.url);
    var params = qs.parse(parsedUrl.query);
    
    if(!matcher.test(parsedUrl.pathname)){
      next()
      return;
    }
    var matches = parsedUrl.pathname.match(matcher)[1].split("/");
    var gitFuncName = matches.shift(); // use first arg
    var git =  createGit(params.repo);
    var gitFunc = git[gitFuncName];
    
    if(typeof gitFunc  != "function"){
      next()
      return;
    }

    params.callback = function(err, result){
      var json = JSON.stringify(result)
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.write(json);
      res.end()
    }
    
    var args = createArgs(gitFunc, params)
    try{
     gitFunc.apply(git, args)
    }catch(e){
      next()
    }
  }
}

// ported by prototype.js
// (wan't good module...)
function argumentNames(func) {
  var names = func.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
    .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
    .replace(/\s+/g, '').split(',');
  return names.length == 1 && !names[0] ? [] : names;
}