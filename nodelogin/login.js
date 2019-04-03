var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'gymhub'
});

var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.static('C:/Users/Shanboos/PhpstormProjects//LastChance/public'));

app.get('/', function(request, response) {
    response.sendFile('/index.html', { root : 'C:/Users/Shanboos/PhpstormProjects//LastChance/public'});
});

app.post('/auth', function(request, response) {
    var login = request.body.emaila;
    var password = request.body.password;
    if (login && password) {
        connection.query('SELECT * FROM klient WHERE email = ? AND password = ?', [login, password], function(error, results, fields) {
            if (results.length > 0) {
              session.loggedin = true;
                session.username = login;
                response.redirect('/account');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.get('/home', function(request, response) {
    if (session.loggedin) {
        response.send('Welcome back, ' + session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

app.get('/signup',function(req,res) {
    res.sendFile('/signup.html', { root : 'C:/Users/Shanboos/PhpstormProjects//LastChance/public'});
});

app.get('/account',function(req,res) {
    res.sendFile('/account.html', { root : 'C:/Users/Shanboos/PhpstormProjects//LastChance/public'});
});

app.get



app.post('/signup', function (request, response) {

    var Imie = request.body.fname;
    var Nazwisko = request.body.lname;
    var Miasto = request.body.city;
    var Email = request.body.email;
    var password = request.body.password;
    var Data_urodzenia = request.body.dataurodzenia;
    var Waga = request.body.weight;

    var sql = "INSERT INTO `klient`(`Imie`, `Nazwisko`, `Miasto`, `Email`, `password`, `Data_urodzenia`, `Waga`) VALUES("+Imie+" , "+Nazwisko+", "+Miasto+","+Email+","+password+", "+Data_urodzenia+", "+Waga+")";
    connection.query(sql);
    response.end();


});
app.post('/changePas', function (request, response) {
    if(!session.loggedin){
        response.send('You are not logged in!');
        response.redirect('/login');
    }
    else{
        var email = request.body.emailch;
        var pass1 = request.body.passwordch;
        var pass2 = request.body.password2ch;
        if(pass1!=pass2){
            response.send("Passwords didnt match!");
            response.redirect('/changepass.html')
            response.end();
        }
        var sql = "UPDATE klient SET password = `pass1` WHERE email = `email` ";
        connection.query(sql);
        response.end();
    }

});

app.post('/changeMail', function (request, response) {
    if(!session.loggedin){
        response.send('You are not logged in!');
        response.redirect('/login');
    }
    else{
        var email = request.body.emailch2;
        var currentMail = request.body.mailNow;
        var sql = "UPDATE klient SET Email = `mail` WHERE Email = `currentMail` ";
        connection.query(sql);
        response.end();
    }

});

app.listen(3000);


