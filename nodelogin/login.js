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

app.use(express.static('D:/pwr/6 semestr/ZTW/ztw_bend-node/public'));//dodac moja sciezke

app.get('/', function(request, response) {
    response.sendFile('/index.html', { root : 'D:/pwr/6 semestr/ZTW/ztw_bend-node/public'});
});

app.post('/auth', function(request, response) {
    var login = request.body.emaila;
    var password = request.body.password;
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

app.get('/home', function(request, response) {
    if (session.loggedin) {
        response.send('Welcome back, ' + session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

app.get('/signup',function(req,res)
{
    res.sendFile('/signup.html', { root : 'D:/pwr/6 semestr/ZTW/ztw_bend-node/public'});//path
});

app.get('/account',function(req,res)
{
    res.sendFile('/account.html', { root : 'D:/pwr/6 semestr/ZTW/ztw_bend-node/public'});
});

app.get('getplans', function (req, res)
{
    var login = session().username;
    var id;
    var id_planu;
    var sql1 = "SELECT Id FROM klient WHERE email = ?";
    connection.query(sql1, [login], function (error, result, fields)
    {
        if (error) throw error;
        id = result[0].valueOf();
        //id = result[0]
    });
    //id = connection.query(sql1, [login]);

    var sql2 = "SELECT IdPlanu FROM plantreningowy WHERE IdKlienta = ?";
    connection.query(sql2, [id], function (error, result, fields)
        {
            if (error) throw error;
            id_planu = result[0].valueOf();
            //id_planu = result[0]
        });

    var sql3 = "SELECT ptls.IdCwiczenia, ptls.Liczba_serii, ptls.Ciezar FROM plantreningowy_listacwiczen ptls WHERE IdPlanu = ?";
    connection.query(sql3, [id_planu], function (error, result, fields)
    {
        for(i in result())
        {
            console.log(result[i]);
        }
    });
})



app.post('/signup', function (request, response) {

    var Imie = request.body.fname;
    var Nazwisko = request.body.lname;
    var Miasto = request.body.city;
    var Email = request.body.email;
    var Password = request.body.password;
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

app.listen(3000);
