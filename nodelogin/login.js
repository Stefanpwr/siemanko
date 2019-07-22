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




app.get('/getplans', function (req, res)
{

    var sql5 =  "SELECT ptlc.IdPlanu, ptlc.IdCwiczenia, lc.opis, lc.Grupa_miesniowa, ptlc.Ciezar, ptlc.Liczba_serii FROM plantreningowy_listacwiczen ptlc JOIN listacwiczen lc ON lc.IdCwiczenia = ptlc.IdCwiczenia ";
    connection.query(sql5, function (error, result, fields)
    {
        if(!error)
        {

        }
    });
});

app.post('/postplans', function (request, response)
{
    var login;
    var klient_id;
    var plan_id;
    var sum_of_callories = 0;
    var one_serries_callories;
    var sum_of_serries;
    var c_data = [];

    if(session.loggedin == true)
    {
        login = session.username;
        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
        connection.query(sql1, [login], function (error, result, fields)
        {
            if (error) throw error;
            else
            {
                //callback(result);
                // klient_id = result;
                klient_id = result[0].IdKlienta.toString();
                parseInt(klient_id, 10);
                // console.log(klient_id);
                // response.send(klient_id);
                // response.send(result);
                var sql2= "SELECT IdPlanu FROM plantreningowy WHERE IdKlienta = ?";
                connection.query(sql2, [klient_id], function (error, result, fields)
                {
                    if (error) throw error;
                    else
                    {
                        plan_id = result[0].IdPlanu.toString();
                        parseInt(plan_id, 10);
                        // console.log(plan_id);

                        var sql5 =  "SELECT ptlc.IdPlanu, ptlc.IdCwiczenia, lc.opis, lc.l_kalorii_seria ,lc.Grupa_miesniowa, ptlc.Ciezar, ptlc.Liczba_serii FROM plantreningowy_listacwiczen ptlc JOIN listacwiczen lc ON lc.IdCwiczenia = ptlc.IdCwiczenia WHERE ptlc.IdPlanu = ? ";
                        connection.query(sql5,[plan_id], function (error, result, fields)
                        {
                            if(!error)
                            {
                                for(var i = 0; i < result.length; i++)
                                {
                                    one_serries_callories = result[i].l_kalorii_seria;
                                    sum_of_serries = result[i].Liczba_serii;
                                    sum_of_callories = sum_of_callories + (one_serries_callories * sum_of_serries);

                                }
                                console.log("suma wszystkich kalorii: "+sum_of_callories);
                                c_data[0] = sum_of_callories;

                                response.render('tabelka.ejs', {page_title:"Plan Treningowy",data:result, data2:c_data});

                            }
                        });

                    }

                });


            }
        });



    }
    else
    {
        response.send("u re not log in");
    }


});
app.get('/logout', function (request, response) {

        request.session.destroy();
    response.end();

})

app.post('/addEx', function (request, response)
{

    var test;
    var cwiczenie_id = request.body.cwiczenie_id.valueOf();
    var liczba_serii = request.body.liczba_serii;
    var ciezar = request.body.ciezar;
    var login;
    var klient_id;
    var plan_id;

    if(session.loggedin == true) {
        login = session.username;
        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
        connection.query(sql1, [login], function (error, result, fields) {
            if (error) throw error;
            else {
                //callback(result);
                // klient_id = result;x`
                klient_id = result[0].IdKlienta.toString();
                parseInt(klient_id, 10);
                console.log(klient_id);
                // response.send(klient_id);
                // response.send(result);
                var sql2 = "SELECT IdPlanu FROM plantreningowy WHERE IdKlienta = ?";
                connection.query(sql2, [klient_id], function (error, result, fields) {
                    if (error) throw error;
                    else {
                        plan_id = result[0].IdPlanu.toString();
                        parseInt(plan_id, 10);
                        console.log(plan_id);

                        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
                        var data1 = [plan_id, cwiczenie_id]
                        var sqlxyz = "SELECT * FROM plantreningowy_listacwiczen WHERE IdPlanu = ? AND IdCwiczenia = ?";
                        connection.query(sqlxyz,data1, function (err, res) {
                            test=res;
                            console.log(test);
                            if(test[0]==null || test[0]== 0 || test==undefined ) {
                                sql = "INSERT INTO plantreningowy_listacwiczen (IdPlanu, IdCwiczenia, Liczba_serii, Ciezar) VALUES ('" + plan_id + "','" + cwiczenie_id + "', '" + liczba_serii + "', '" + ciezar + "' )";
                                connection.query(sql, function (err, res, fields) {
                                    if (!err) {
                                        response.redirect("CreatePlan.html")

                                    }
                                });
                            }else{
                                    var data = [liczba_serii, ciezar, plan_id,cwiczenie_id]
                                sql = "UPDATE plantreningowy_listacwiczen SET   Liczba_serii = ?, Ciezar=? WHERE IdPlanu = ? AND IdCwiczenia = ?";
                                connection.query(sql,data, function (err, res, fields) {
                                    if (!err) {
                                        response.redirect("CreatePlan.html")

                                    }
                                    else{
                                        console.log("wykurwiuj");
                                    }
                                });
                            }

                        })



                    }
                });
            }
        });
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

    var sql = "INSERT into klient (Imie, Nazwisko, Miasto, Email, password, Data_urodzenia, Waga) VALUES ('" +Imie+ "', '"+Nazwisko+"', '"+Miasto+"', '"+Email+"', '"+Password+"', '"+Data_urodzenia+"', '"+Waga+"')";
    connection.query(sql);
    response.redirect('/account');

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

app.post('/addTemplate1', function (request, response)
{


    if(session.loggedin == true) {
        login = session.username;
        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
        connection.query(sql1, [login], function (error, result, fields) {
            if (error) throw error;
            else {

                klient_id = result[0].IdKlienta.toString();
                parseInt(klient_id, 10);
                console.log(klient_id);

                var sql2 = "SELECT IdPlanu FROM plantreningowy WHERE IdKlienta = ?";
                connection.query(sql2, [klient_id], function (error, result, fields) {
                    if (error) throw error;
                    else {
                        plan_id = result[0].IdPlanu.toString();
                        parseInt(plan_id, 10);
                        console.log(plan_id);

                        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
                        sql = "INSERT INTO plantreningowy_listacwiczen (IdPlanu, IdCwiczenia, Liczba_serii, Ciezar) VALUES ('" + plan_id + "','" + 1  + "', '" + 4 + "', '" + 60 + "' )";
                        connection.query(sql, function (err, res, fields) {
                            if (!err) {
                                response.redirect("CreatePlan.html")
                            }
                        });
                        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
                        sql = "INSERT INTO plantreningowy_listacwiczen (IdPlanu, IdCwiczenia, Liczba_serii, Ciezar) VALUES ('" + plan_id + "','" + 3  + "', '" + 4 + "', '" + 50 + "' )";
                        connection.query(sql, function (err, res, fields) {
                            if (!err) {

                            }
                        });
                        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
                        sql = "INSERT INTO plantreningowy_listacwiczen (IdPlanu, IdCwiczenia, Liczba_serii, Ciezar) VALUES ('" + plan_id + "','" + 8  + "', '" + 4 + "', '" + 20 + "' )";
                        connection.query(sql, function (err, res, fields) {
                            if (!err) {

                            }
                        });
                        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
                        sql = "INSERT INTO plantreningowy_listacwiczen (IdPlanu, IdCwiczenia, Liczba_serii, Ciezar) VALUES ('" + plan_id + "','" + 6  + "', '" + 4 + "', '" + 18 + "' )";
                        connection.query(sql, function (err, res, fields) {
                            if (!err) {

                            }
                        });
                    }
                });
            }
        });
    }
});

app.post('/addTemplate2', function (request, response)
{


    if(session.loggedin == true) {
        login = session.username;
        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
        connection.query(sql1, [login], function (error, result, fields) {
            if (error) throw error;
            else {
                //callback(result);
                // klient_id = result;
                klient_id = result[0].IdKlienta.toString();
                parseInt(klient_id, 10);
                console.log(klient_id);
                // response.send(klient_id);
                // response.send(result);
                var sql2 = "SELECT IdPlanu FROM plantreningowy WHERE IdKlienta = ?";
                connection.query(sql2, [klient_id], function (error, result, fields) {
                    if (error) throw error;
                    else {
                        plan_id = result[0].IdPlanu.toString();
                        parseInt(plan_id, 10);
                        console.log(plan_id);

                        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
                        sql = "INSERT INTO plantreningowy_listacwiczen (IdPlanu, IdCwiczenia, Liczba_serii, Ciezar) VALUES ('" + plan_id + "','" + 2  + "', '" + 4 + "', '" + 20 + "' )";
                        connection.query(sql, function (err, res, fields) {
                            if (!err) {
                                response.redirect("CreatePlan.html")
                            }
                        });
                        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
                        sql = "INSERT INTO plantreningowy_listacwiczen (IdPlanu, IdCwiczenia, Liczba_serii, Ciezar) VALUES ('" + plan_id + "','" + 4  + "', '" + 4 + "', '" + 40 + "' )";
                        connection.query(sql, function (err, res, fields) {
                            if (!err) {

                            }
                        });
                        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
                        sql = "INSERT INTO plantreningowy_listacwiczen (IdPlanu, IdCwiczenia, Liczba_serii, Ciezar) VALUES ('" + plan_id + "','" + 9  + "', '" + 4 + "', '" + 70 + "' )";
                        connection.query(sql, function (err, res, fields) {
                            if (!err) {

                            }
                        });
                        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
                        sql = "INSERT INTO plantreningowy_listacwiczen (IdPlanu, IdCwiczenia, Liczba_serii, Ciezar) VALUES ('" + plan_id + "','" + 6  + "', '" + 4 + "', '" + 18 + "' )";
                        connection.query(sql, function (err, res, fields) {
                            if (!err) {

                            }
                        });
                        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
                        sql = "INSERT INTO plantreningowy_listacwiczen (IdPlanu, IdCwiczenia, Liczba_serii, Ciezar) VALUES ('" + plan_id + "','" + 7  + "', '" + 4 + "', '" + 25 + "' )";
                        connection.query(sql, function (err, res, fields) {
                            if (!err) {

                            }
                        });
                    }
                });
            }
        });
    }
});

app.get('/delete:IdCwiczenia', function (req, res) {
    var IdCwicz = req.params.IdCwiczenia;
    var data = [IdCwicz];
    console.log(IdCwicz);

        connection.query("DELETE FROM plantreningowy_listacwiczen WHERE IdCwiczenia = ? ",data, function (err2, results) {
            var login;
            var klient_id;
            var plan_id;

            if(session.loggedin == true)
            {
                login = session.username;
                var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
                connection.query(sql1, [login], function (error, result, fields)
                {
                    if (error) throw error;
                    else
                    {

                        klient_id = result[0].IdKlienta.toString();
                        parseInt(klient_id, 10);
                        console.log(klient_id);

                        var sql2= "SELECT IdPlanu FROM plantreningowy WHERE IdKlienta = ?";
                        connection.query(sql2, [klient_id], function (error, result, fields)
                        {
                            if (error) throw error;
                            else
                            {
                                plan_id = result[0].IdPlanu.toString();
                                parseInt(plan_id, 10);
                                console.log(plan_id);

                                var sql5 =  "SELECT ptlc.IdPlanu, ptlc.IdCwiczenia, lc.opis, lc.Grupa_miesniowa, ptlc.Ciezar, ptlc.Liczba_serii FROM plantreningowy_listacwiczen ptlc JOIN listacwiczen lc ON lc.IdCwiczenia = ptlc.IdCwiczenia WHERE ptlc.IdPlanu = ? ";
                                connection.query(sql5,[plan_id], function (error, result, fields)
                                {
                                    if(!error)
                                    {

                                        res.render('tabelka.ejs', {page_title:"Plan Treningowy",data:result});


                                    }
                                });

                            }

                        });


                    }
                });



            }
            else
            {
                res.send("u re not log in");
            }


        });

    });

app.post('/updateWeight', function (req, res) {
    var waga = req.body.newWeight;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var klient_id;
    var login;

    today = yyyy + '-' + mm + '-' + dd;
    var xd = today.toString();


    if (session.loggedin == true) {
        login = session.username;
        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
        connection.query(sql1, [login], function (error, result, fields) {
            if (error) throw error;
            else {
                klient_id = result[0].IdKlienta.toString();
                parseInt(klient_id, 10);

            }

            console.log(xd);
            console.log(waga);
            console.log(today);

            var sql2 = "INSERT INTO archiwum (IdKlienta, Waga, data_pomiaru) VALUES ('" + klient_id + "','" + waga + "', '" + xd + "')";
            connection.query(sql2);
            var sql3 = "UPDATE klient SET Waga = ? WHERE IdKlienta = ?";
            connection.query(sql3, [waga, klient_id]);
        });
    }
    res.redirect('/account');
});

app.post('/getWeightChar', function (request, response)
{
    var login;
    var klient_id;
    var weight_tab = [];
    var data_tab = [];
    var data;
    var weight;

    if(!session.loggedin)
    {
        response.send('You are not logged in!');
        response.redirect('/login');
    }
    else
    {
        login = session.username;
        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
        connection.query(sql1, [login], function (error, result, fields)
        {
            if (error) throw error;
            else {
                klient_id = result[0].IdKlienta.toString();
                parseInt(klient_id, 10);
                console.log(klient_id);
            }
            // var sql2 = "SELECT * FROM archiwum WHERE IdKlienta = ?";
            var sql2 = "SELECT Waga, CONCAT(DAYOFMONTH(data_pomiaru), '.', Month(data_pomiaru), '.', Year(data_pomiaru)) AS ddata FROM archiwum"
            // var sql2 = "SELECT Waga, CONCAT(DAYOFMONTH(data_pomiaru),Month(data_pomiaru),Year(data_pomiaru)) AS ddata FROM archiwum"

            connection.query(sql2, [klient_id], function (error, result, fields)
            {
                if (!error)
                {


                    for(var i=0; i < result.length; i++)
                    {
                        weight = result[i].Waga;
                        parseInt(weight,10);

                        data = result[i].ddata.toString();

                        weight_tab[i]= weight;
                        data_tab[i]=data;
                    }

                    console.log(data_tab);


                    response.render('chart.ejs', {page_title:"Wykres wagi",data1:weight_tab, data2:data_tab});

                }

            })
        })
    }
});

app.post('/calculatePlanCalories', function (request, response)
{
    var login;
    var klient_id;
    var plan_id;
    var cwiczenie_id;
    var one_serries_callories;
    var sum_of_callories=0;
    var exercise_tab;
    var sum_of_serries;

    if(!session.loggedin)
    {
        response.send('You are not logged in!');
        response.redirect('/login');
    }
    else
    {
        login = session.username;
        var sql1 = "SELECT IdKlienta FROM klient WHERE email = ?"
        connection.query(sql1, [login], function (error, result, fields)
        {
            if (error) throw error;
            else {

                klient_id = result[0].IdKlienta.toString();
                parseInt(klient_id, 10);
                console.log(klient_id);

                var sql2 = "SELECT IdPlanu FROM plantreningowy WHERE IdKlienta = ?";
                connection.query(sql2, [klient_id], function (error, result, fields) {
                    if (error) throw error;
                    else {
                        plan_id = result[0].IdPlanu.toString();
                        parseInt(plan_id, 10);
                        console.log(plan_id);

                        var sql5 = "SELECT ptlc.IdPlanu, ptlc.IdCwiczenia, lc.l_kalorii_seria, ptlc.Liczba_serii, ptlc.Ciezar FROM plantreningowy_listacwiczen ptlc JOIN listacwiczen lc ON lc.IdCwiczenia = ptlc.IdCwiczenia WHERE ptlc.IdPlanu = ? ";
                        connection.query(sql5, [plan_id], function (error, result, fields) {
                            if (!error) {

                                exercise_tab = result;
                                for(var i = 0; i < result.length; i++)
                                {
                                    one_serries_callories = result[i].l_kalorii_seria;
                                    console.log("kalorie w serii: "+one_serries_callories);

                                    sum_of_serries = result[i].Liczba_serii;
                                    console.log("suma serii: "+sum_of_serries);

                                    sum_of_callories = sum_of_callories + (one_serries_callories * sum_of_serries);

                                }
                                console.log("suma wszystkich kalorii: "+sum_of_callories);
                                response.send('Sum of callories: ' + sum_of_callories);

                            }
                        });

                    }

                });
            }
        });


    }


});




app.listen(3000);