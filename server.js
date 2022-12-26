var express = require("express");
var exphbs =require('express-handlebars')
var path=require("path");
var app = express();
http = require('http')
var connect = require('./db')



// adding assets to use css and html
app.use(express.static(__dirname + '/assets'));

// To set sidebar and navbar as component 
app.engine('hbs', exphbs.engine({
  extname : '.hbs',
}));
app.set('view engine', 'handlebars');

// dashboard page 
app.get("/", async function(req,res){
res.render(path.join(__dirname,"/views/overview.hbs"))
});
// new release page 
app.get("/new-release", async function(req,res){
res.render(path.join(__dirname,"/views/forms.hbs"))
});
// music catalog page
app.get("/music-catalog", async function(req,res){
res.render(path.join(__dirname,"/views/cards.hbs"))
});
// label management page
app.get("/label-manage", async function(req,res){
res.render(path.join(__dirname,"/views/charts.hbs"))
});
// artist management page
app.get("/artist-manage", async function(req,res){
res.render(path.join(__dirname,"/views/buttons.hbs"))
});
// finance management page
app.get("/finance-manage", async function(req,res){
res.render(path.join(__dirname,"/views/modals.hbs"))
});
// analytics manage page 
app.get("/analytics-manage", async function(req,res){
res.render(path.join(__dirname,"/views/tables.hbs"))
});
// you tube request page
app.get("/you-tube-req", async function(req,res){
res.render(path.join(__dirname,"/views/overview.hbs"))
});

// db connection
connect.connectDb()
connect.initialize()

// listening on 8080 
// TODO: Add to listen on different port passed as env var
app.listen(8080)
console.log("server is listening at port 8080")
