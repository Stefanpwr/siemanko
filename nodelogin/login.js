var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var crypto = require('crypto');
const jsdom = require('jsdom');
const{JSDOM} = jsdom;

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

app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.static('C:/Users/Shanboos/PhpstormProjects/LastChance/public'));//dodac moja sciezke

app.get('/', function(request, response) {
    response.sendFile('/index.html', { root : 'C:/Users/Shanboos/PhpstormProjects/LastChance/public'});
});

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
    res.sendFile('/signup.html', { root : 'C:/Users/Shanboos/PhpstormProjects/LastChance/public'});//path
});

app.get('/account',function(req,res)
{
    res.sendFile('/account.html', { root : 'C:/Users/Shanboos/PhpstormProjects/LastChance/public'});
});

app.get('/showplans', function (req,res)
{
    res.sendFile('/showplans.html', { root : 'C:/Users/Shanboos/PhpstormProjects/LastChance/public'});

});

app.get('/createPlan', function (req, res)
{
    res.sendFile('/CreatePlan.html', {root: 'C:/Users/Shanboos/PhpstormProjects/LastChance/public'});
});

// app.get('getplans', function (req, res)
// {
//
//     var login = session().username;
//     var id;
//     var id_planu;
//     var sql1 = "SELECT Id FROM klient WHERE email = ?";
//     connection.query(sql1, [login], function (error, result, fields)
//     {
//         if (error) throw error;
//         id = result[0].valueOf();
//         //id = result[0]
//     });
//     //id = connection.query(sql1, [login]);
//
//     var sql2 = "SELECT IdPlanu FROM plantreningowy WHERE IdKlienta = ?";
//     connection.query(sql2, [id], function (error, result, fields)
//         {
//             if (error) throw error;
//             id_planu = result[0].valueOf();
//             //id_planu = result[0]
//         });
//
//     var sql3 = "SELECT ptls.IdCwiczenia, ptls.Liczba_serii, ptls.Ciezar FROM plantreningowy_listacwiczen ptls WHERE IdPlanu = ?";
//     connection.query(sql3, [id_planu], function (error, result, fields)
//     {
//         for(i in result())
//         {
//             console.log(result[i]);
//         }
//     });
// });



app.get('/getplans', function (req, res)
{
    // var login = session().username;
    // var id;
    // var id_planu;
    // var sql1 = "SELECT Id FROM klient WHERE email = ?";
    // connection.query(sql1, [login], function (error, result, fields)
    // {
    //     if (error) throw error;
    //     else
    //         {
    //             id = result[0].valueOf();
    //             //id = result[0]
    //         }
    // });
    // //id = connection.query(sql1, [login]);
    //
    // var sql2 = "SELECT IdPlanu FROM plantreningowy WHERE IdKlienta = ?";
    // connection.query(sql2, [id], function (error, result, fields)
    //     {
    //         if (error) throw error;
    //         else {
    //             id_planu = result[0].valueOf();
    //             //id_planu = result[0]
    //         }
    //     });
    //
    // var sql3 = "SELECT ptls.IdCwiczenia, ptls.Liczba_serii, ptls.Ciezar FROM plantreningowy_listacwiczen ptls WHERE IdPlanu = ?";
    // connection.query(sql3, [id_planu], function (error, result, fields)
    // {
    //     for(i in result())
    //     {
    //         console.log(result[i]);
    //     }
    // });
    var sql5 =  "SELECT ptlc.IdPlanu, ptlc.IdCwiczenia, lc.opis, lc.Grupa_miesniowa, ptlc.Ciezar, ptlc.Liczba_serii FROM plantreningowy_listacwiczen ptlc JOIN listacwiczen lc ON lc.IdCwiczenia = ptlc.IdCwiczenia ";
    connection.query(sql5, function (error, result, fields)
    {
        if(!error)
        {
            //res.sendFile(_dirname + "/que.html");
            //console.log(result);
            //res.render('/showplans',{page_title:"Test Table",data:result});
            // res.send(result);
            // for(i in result())
            // {
            //     console.log(result[i]);
            // }
            // res.end();
        }
    });
});

app.post('/postplans', function (request, response)
{
    var sql5 =  "SELECT ptlc.IdPlanu, ptlc.IdCwiczenia, lc.opis, lc.Grupa_miesniowa, ptlc.Ciezar, ptlc.Liczba_serii FROM plantreningowy_listacwiczen ptlc JOIN listacwiczen lc ON lc.IdCwiczenia = ptlc.IdCwiczenia ";
    connection.query(sql5, function (error, result, fields)
    {
        if(!error)
        {

             response.render('tabelka.ejs', {page_title:"Jebac disa",data:result});

           // response.render('plans.html');

            //res.sendFile(_dirname + "/que.html");
                        //res.render('/showplans',{page_title:"Test Table",data:result});
            //response.fetch
          //  response.send(result);
            //document.write(result);
            // for(i in result())
            // {
            // console.log(result[i]);
            // response.send(" " + result[i])
            // }
            // res.end();
        }
    });
});

app.post('/addEx', function (request, response)
{
    var cwiczenie_id = request.body.cwiczenie_id;
    var liczba_serii = request.body.liczba_serii;
    var ciezar = request.body.ciezar;

    sql = "INSERT INTO plantreningowy_listacwiczen (IdPlanu, IdCwiczenia, Liczba_serii, Ciezar) VALUES ('1','"+cwiczenie_id+"', '"+liczba_serii+"', '"+ciezar+"' )";
    connection.query(sql, function (err, res, fields)
    {
        if(!err)
        {
            response.redirect("CreatePlan.html")
        }

    })

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

app.listen(3000);