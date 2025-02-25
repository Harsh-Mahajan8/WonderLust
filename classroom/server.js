const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({ 
    secret: " notagoodsecret ",
    resave:false,
    saveUninitialized:true,
}));

app.get('/register', (req,res) => {
    let { nam = "harsh" } = req.query;
    req.session.nam = nam;
    console.log(req.session);
    res.redirect('/greet');
})
app.get('/greet' ,(req, res) => {
    res.send(`hello,${req.session.nam}`);
})

app.listen(3000, (req,res) => {
    console.log("server is working at 3000");
});
// app.get('/', (req, res) => {
//     if(req.session.count){
//         req.session.count++
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`no of session is ${req.session.count}`);
// });