const express = require('express');
const session = require('express-session');
const nocache = require('nocache');
const path = require('path');
const fakedata = require('./fakedata.json');

const app = express();
const router = express.Router()

app.use(session({
  secret: 'password',        
  resave: false,                    
  saveUninitialized: true,          
  cookie: {
    secure: false,                  
    maxAge: 1000 * 60 * 60          
  }
}));
app.use(nocache());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());





app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/',(req, res) => {
  if (!req.session.username) return res.redirect('/login');
  res.render('home', { username: req.session.username });
});

app.get('/login', (req, res) => {
  if (req.session.username) return res.redirect('/');
  res.render('login', { invalidcred: false });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username == fakedata.name && password == fakedata.password) {
    req.session.username = username;
    return res.redirect('/');
  } else {
    return res.render('login', { invalidcred: true });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error logging out');
    }
    res.redirect('/login');
  });
});


app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
