var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var crypto = require('crypto');
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

app.post('/auth', function(request, response) {
    var login = request.body.emaila;
    var password = crypto.createHash('md5').update(request.body.password).digest('hex');

    if (login && password) {
        connection.query("SELECT * FROM klient WHERE email = ? AND password = ?", [login, password], function(error, results, fields) {
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

app.post('/signup', function (request, response) {

    var Imie = request.body.fname;
    var Nazwisko = request.body.lname;
    var Miasto = request.body.city;
    var Email = request.body.email;
    var Password = crypto.createHash('md5').update(request.body.password).digest('hex');
    var Data_urodzenia = request.body.dataurodzenia;
    var Waga = request.body.weight;

    //var sql = "INSERT into klient (Imie, Nazwisko, Miasto, Email, password, Data_urodzenia, Waga) VALUES ('+ Imie +', '+Nazwisko+', '+Miasto+', '+Email+', '+Password+', '+Data_urodzenia+', '+Waga+')";
    var sql = "INSERT into klient (Imie, Nazwisko, Miasto, Email, password, Data_urodzenia, Waga) VALUES ('" +Imie+ "', '"+Nazwisko+"', '"+Miasto+"', '"+Email+"', '"+Password+"', '"+Data_urodzenia+"', '"+Waga+"')";
    //var sql = "INSERT into klient (Imie, Nazwisko, Miasto, Email, password, Data_urodzenia, Waga) VALUES ($Imie, $Nazwisko, $Miasto, $Email, $Password, $Data_urodzenia, $Waga)";
    connection.query(sql);
    response.redirect('/account');
    //response.end();
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
        //connection.query('UPDATE users SET Name = ? WHERE UserID = ?', [name, userId])
        var sql = "UPDATE klient SET password = ? WHERE email = ?";
        connection.query(sql,[pass1, email]);
        response.end();
    }

});

app.post('/changeMail', function (request, response) {
    if(!session.loggedin){
        response.send('You are not logged in!');
        response.redirect('/login');
    }
    else{
        var emailn = request.body.emailch2;
        var currentMail = request.body.mailNow;
        var sql = "UPDATE klient SET Email = ? WHERE Email = ? ";
        connection.query(sql, [emailn, currentMail]);
        response.end();
    }

});


