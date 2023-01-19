var express = require("express");
var exphbs = require('express-handlebars')
var clientSessions = require('client-sessions')
const bodyParser = require('body-parser')
var path = require("path");
var app = express();
http = require('http');
const api = require('./api');
const multer = require('multer')
const upload = multer()
const fs = require('fs');
// To run on Different port too
var HTTP_PORT = process.env.PORT || 8080;

// for simple data
app.use(bodyParser.urlencoded({ extended: true }))
app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "dashboard_user_details", // this should be a long un-guessable string.
  duration: 30 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));
// setup a 'route' to listen on the default url path (http://localhost)
app.use(express.static('public'));

// to store label nda files
const ndaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Choose the destination based on data in the request
    const destination = `uploads/nda/${req.session.user.email}/Label-${req.body.title}/`;
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true, mode: 0o777 }, (err) => {
        if (err) return cb(err, null);
      });
    }
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    // You can also set the filename here
    cb(null, file.originalname);
  },
});

// storing album images
const albumImageStorage = multer.diskStorage({

  destination: (req, file, cb) => {
    // Choose the destination based on data in the request
    const destination = `uploads/albums/${req.session.user.email}/${req.body.title}/`;
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true, mode: 0o777 });
    }
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    // You can also set the filename here
    cb(null, file.originalname);
  },
});

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}
// adding assets to use css and html
app.use(express.static(__dirname + '/assets'));

// To set sidebar and navbar as component 
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
}));
app.set('view engine', 'handlebars');



// Routes play area
// dashboard page
app.get("/", ensureLogin, async function (req, res) {
  res.render(path.join(__dirname, "/views/overview.hbs"))
});
// new release page 
app.get("/new-release", ensureLogin, async function (req, res) {
  res.render(path.join(__dirname, "/views/new-release.hbs"))
});
app.post("/album-manage/addAlbum", ensureLogin, multer({ albumImageStorage }).single('albumImage'), async function (req, res) {
  console.log("got file here ", req.file)
  req.body.imageUrl = `./uploads/albums/${req.session.user.email}/${req.body.title}/`
  req.body.userID = req.session.user.userID
  api.saveAlbum(req.body).then((albumID) => {
    res.status(200).json({ albumID: albumID.id });
  }).catch((err) => {
    console.log("Error saving album data", err)
    res.status(503).json({ error: err });
  })
})
// adding song
app.post("/album-manage/addSong", ensureLogin, async function (req, res) {
  
})

//updateAlbum
app.put("/album-manage/updateAlbum:id", ensureLogin, async function (req, res) {
  const albumID = req.params.id;
  api.updateAlbum(albumID, req.body)
  res.status(201).json({ success: true });
});
// music catalog page
app.get("/music-catalog", ensureLogin, async function (req, res) {
  res.render(path.join(__dirname, "/views/label-manage.hbs"))
});
// label management page
app.get("/label-manage", ensureLogin, async function (req, res) {
  api.getAllLabelsForUserIDForUser(req.session.user.userID).then((labelData) => {
    res.render(path.join(__dirname, "/views/label-manage.hbs"), { label: labelData })
  }).catch((err) => {
    res.render(path.join(__dirname, "/views/label-manage.hbs"), { errorMessage: "Unable to fetch Label for user " + req.session.user.email + err })
  })
});
app.post("/label-manage", ensureLogin, multer({ ndaStorage }).single('nda'), async function (req, res) {
  req.body.filename = `uploads/nda/${req.session.user.email}/${req.body.title}/${req.file.originalname}`
  api.addLabelForUserWithID(req.body, req.session.user.userID).then(() => {
    res.redirect('/label-manage')
  }).catch((err) => {
    res.render(path.join(__dirname, "/views/label-manage.hbs"), { errorMessage: "Unable to save label " + req.body.title + " " + err })
  })
});
app.post("/delete-label/:id", ensureLogin, async function (req, res) {
  api.deleteLabel(req.body, req.session.user.userID).then(() => {
    res.redirect('/label-manage')
  }).catch((err) => {
    res.render(path.join(__dirname, "/views/label-manage.hbs"), { errorMessage: "Unable to delete label try again!" })
  })
});
// artist management page
app.get("/artist-manage", ensureLogin, async function (req, res) {
  api.getAllArtistsForUserID(req.session.user.userID).then((allArtists) => {
    res.status(200).json({ allArtists: allArtists });
  })
  res.render(path.join(__dirname, "/views/buttons.hbs"))
});

app.post("/artist-manage/update", ensureLogin, async function (req, res) {
  api.updateArtist(req.body, req.session.user.userID).then(() => {
    res.redirect('/artist-manage')
  }).catch((err) => {
    res.render(path.join(__dirname, "/views/artist-manage.hbs"), { errorMessage: "Unable to Update Artist " })
  })
});
// finance management page
app.get("/finance-manage", ensureLogin, async function (req, res) {
  res.render(path.join(__dirname, "/views/modals.hbs"))
});
// analytics manage page 
app.get("/analytics-manage", ensureLogin, async function (req, res) {
  res.render(path.join(__dirname, "/views/tables.hbs"))
});
// you tube request page
app.get("/you-tube-req", ensureLogin, async function (req, res) {
  res.render(path.join(__dirname, "/views/overview.hbs"))
});


// User Login, register

// Don't Touch Logic without Permission
app.get('/login', function (req, res) {
  res.render(path.join(__dirname, "/views/login.hbs"))
});
app.get('/register', function (req, res) {
  res.render(path.join(__dirname, "/views/register.hbs"))
});
app.post('/register', (req, res, next) => {
  api.registerUser(req.body).then(() => {
    res.render(path.join(__dirname, "/views/register.hbs"), { successMessage: "Registration Successful click for login " });
  }).catch((err) => {
    console.error(err)
    res.render(path.join(__dirname, "/views/register.hbs"), { errorMessage: err, userName: req.body.email });
  })
});
app.post('/login', (req, res, next) => {
  if (req.session.user) {
    res.redirect("/logout");
  }
  req.body.userAgent = req.get('User-Agent');
  api.login(req.body).then((userData) => {
    req.session.user = {
      userID: userData._id,
      email: userData.email,
    }
    res.redirect('/');
  }).catch((err) => {
    res.render(path.join(__dirname, "/views/login.hbs"), { errorMessage: err, userName: req.body.email });
  })
});
app.get('/logout', function (req, res) {
  req.session.reset();
  res.redirect("/login");
});
app.get('*', function (req, res) {
  res.render(path.join(__dirname, "/views/404.hbs"))
})

api.connectWithDB().then(() => {
  api.initializeDatabase().then(() => {
    app.listen(HTTP_PORT)
    console.log("server is listening at port 8080")
  }).catch((err) => {
    console.error("err:", err)
  })
}).catch((err) => {
  console.error("err", err)
})

