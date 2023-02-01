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
const { resolve } = require("path");
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
        const destination = `./assets/uploads/${req.session.user.email}/nda/Label-${req.body.title}/`;
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true, mode: 0o777 })
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
        const destination = `./assets/uploads/${req.session.user.email}/albums/${req.body.title}/`;
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
const songFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Choose the destination based on data in the request
        const destination = `./assets/uploads/${req.session.user.email}/albums/${req.body.title}/Songs/`
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
const artistDocumentStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        // Choose the destination based on data in the request
        const destination = `./assets/uploads/artist/${req.session.user.email}/${req.body.id}/`;
        req.body.filePath = `./uploads/artist/${req.session.user.email}/${req.body.id}/`;
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
app.get("/draftToRelease/:draft", ensureLogin, async function (req, res) {
    const id = req.params.draft;
    res.render(path.join(__dirname, "/views/draft-release.hbs"), { "draftId": id })
});

//drafts page
app.get("/drafts", ensureLogin, async function (req, res) {
    res.render(path.join(__dirname, "/views/drafts.hbs"))
});

app.get("/drafts", ensureLogin, async function (req, res) {
    res.render(path.join(__dirname, "/views/drafts.hbs"))
});

//Completes Page
app.get("/completes", ensureLogin, async function (req, res) {
    res.render(path.join(__dirname, "/views/completes.hbs"))
});
app.get("/genre", ensureLogin, async function (req, res) {
    try {
        api.getGenre().then((data) => {
            res.status(200).json({ genre: data });
        }).catch((err) => {
            console.log(err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
// data for album
app.get("/songs", ensureLogin, async function (req, res) {
    try {
        api.getAllSongsForUser(req.session.user.userID).then((data) => {
            res.status(200).json({ songs: data });
        }).catch((err) => {
            console.log(err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.get("/album-drafts", ensureLogin, async function (req, res) {
    try {
        api.getDraftAlbumsForUser(req.session.user.userID).then((data) => {
            res.status(200).json({ album: data });
        }).catch((err) => {
            console.log(err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.get("/album-completed", ensureLogin, async function (req, res) {
    try {
        api.getCompletedAlbumsForUser(req.session.user.userID).then((data) => {
            res.status(200).json({ album: data });
        }).catch((err) => {
            console.log(err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }

});

app.get("/album-song/:id", ensureLogin, async function (req, res) {
    try {
        const id = req.params.id;
        api.getSongsForAlbum(id).then((songData) => {
            console.log("data send ", songData)
            res.status(200).json({ songs: songData });
        }).catch((err) => {
            console.log(err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
})
app.get("/albumStores", ensureLogin, async function (req, res) {
    try {
        api.getStores().then((stores) => {
            res.status(200).json({ stores: stores });
        }).catch((err) => {
            console.log(err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.post("/album-manage/addAlbum", ensureLogin, multer({ storage: albumImageStorage }).single('albumImage'), async function (req, res) {
    try {
        req.body.imageUrl = `./uploads/${req.session.user.email}/albums/${req.body.title}/${req.file.originalname}`
        req.body.userID = req.session.user.userID
        api.saveAlbum(req.body).then((album) => {
            console.log("saved album with id : ", album)
            res.status(200).json({ album: album });
        }).catch((err) => {
            console.log("Error saving album data", err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.delete("/album-manage/:id", ensureLogin, async function (req, res) {
    try {
        const id = req.params.id;
        api.deleteAlbum(id, req.session.user.userID).then(() => {
            res.status(200).json({ message: "delete success" });
        }).catch((err) => {
            console.log(err)
            res.status(503).json({ error: "delete failed" })
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
// add song for album
app.post("/album-manage/addSong", ensureLogin, multer({ storage: songFileStorage }).single('filePath'), async function (req, res) {
    try {
        req.body.filePath = `./uploads/albums/${req.session.user.email}/${req.body.albumID}/Songs/${req.file.originalname}`
        req.body.userID = req.session.user.userID
        api.saveSongData(req.body).then((data) => {
            res.status(200).json({ songID: data });
        }).catch((err) => {
            console.log("Error saving songs data", err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.post("/album-manage/updateSong", ensureLogin, multer({ storage: songFileStorage }).array('filePath'), async function (req, res) {
    try {
        req.body.filePath = `./uploads/albums/${req.session.user.email}/${req.body.albumID}/Songs/${req.file.originalname}`
        console.log("got data to update : ", req.body)
        req.body.userID = req.session.user.userID
        api.updateSongData(req.body).then(() => {
            res.status(200).json({ message: "song updated successfully" });
        }).catch((err) => {
            console.log("Error updating song data", err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
//updateAlbum
app.post("/album-manage/updateAlbum", ensureLogin, multer({ storage: albumImageStorage }).single('albumImage'), async function (req, res) {
    try {
        req.body.imageUrl = `./uploads/${req.session.user.email}/albums/${req.body.title}/${req.file.originalname}`
        req.body.userID = req.session.user.userID
        api.updateAlbum(req.body).then(() => {
            res.status(200).json({ message: "Update Success" });
        }).catch((err) => {
            console.log("Error saving album data", err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.post("/album-manage/updateSongArray", ensureLogin, multer({ storage: albumImageStorage }).single('albumImage'), async function (req, res) {
    try {
        req.body.userID = req.session.user.userID
        req.body.songs = JSON.parse(req.body.songs)
        api.updateSongsArrayInAlbum(req.body).then(() => {
            res.status(200).json({ message: "successfully saved Songs" })
        }).catch((err) => {
            console.log("Error saving album data", err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.post("/album-manage/updateStoresArray", ensureLogin, multer({ storage: albumImageStorage }).single('albumImage'), async function (req, res) {
    try {
        req.body.userID = req.session.user.userID
        req.body.stores = JSON.parse(req.body.stores)
        api.updateStoresArrayInAlbum(req.body).then(() => {
            res.status(200).json({ message: "successfully saved stores" })
        }).catch((err) => {
            console.log("Error saving album data", err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.post("/album-manage/completed", ensureLogin, multer({ storage: albumImageStorage }).single('albumImage'), async function (req, res) {
    try {
        req.body.userID = req.session.user.userID
        api.updateToCompletedAlbum(req.body).then(() => {
            res.status(200).json({ message: "successfully saved album" })
        }).catch((err) => {
            console.log("Error saving album data", err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
// music catalog page
app.get("/music-catalog", ensureLogin, async function (req, res) {
    res.render(path.join(__dirname, "/views/label-manage.hbs"))
});
// label management page
app.get("/label-manage", ensureLogin, async function (req, res) {
    api.getAllLabelsForUserIDForUser(req.session.user.userID).then((labelData) => {
        res.render(path.join(__dirname, "/views/label-manage.hbs"))
    }).catch((err) => {
        res.render(path.join(__dirname, "/views/label-manage.hbs"), { errorMessage: "Unable to fetch Label for user " + req.session.user.email + err })
    })
});
app.get("/label-manage/labels", ensureLogin, async function (req, res) {
    try {
        api.getAllLabelsForUserIDForUser(req.session.user.userID).then((labelData) => {
            res.status(200).json({ labelData: labelData });
        }).catch((err) => {
            console.log("Error saving label data", err)
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.post("/label-manage", ensureLogin, multer({ storage: ndaStorage }).single('nda'), async function (req, res) {
    try {
        req.body.filename = `uploads/nda/${req.session.user.email}/${req.body.title}/${req.file.originalname}`
        api.addLabelForUserWithID(req.body, req.session.user.userID).then((label) => {
            res.status(200).json({ id: label.id });
        }).catch((err) => {
            res.status(503).json({ error: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.delete("/label-manage/:id", ensureLogin, async function (req, res) {
    try {
        const id = req.params.id;
        api.deleteLabel(id, req.session.user.userID).then(() => {
            res.status(200).json({ message: "delete success" });
        }).catch((err) => {
            console.log(err)
            res.status(503).json({ error: "delete failed" })
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.post("/label-manage/update", ensureLogin, multer({ storage: ndaStorage }).single('nda'), async function (req, res) {
    try {
        req.body.filename = `uploads/nda/${req.session.user.email}/${req.body.title}/${req.file.originalname}`
        api.updateLabel(req.body).then(() => {
            res.status(200).json({ message: "success label update" });
        }).catch((err) => {
            console.log(err)
            res.status(503).json({ message: "failed label update" });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.post("/delete-label/:id", ensureLogin, async function (req, res) {
    try {
        api.deleteLabel(req.body, req.session.user.userID).then(() => {
            res.redirect('/label-manage')
        }).catch((err) => {
            res.render(path.join(__dirname, "/views/label-manage.hbs"), { errorMessage: "Unable to delete label try again!" })
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
// artist management page
app.get("/artist-manage", ensureLogin, async function (req, res) {
    try {
        api.getAllArtistsWithUserID(req.session.user.userID).then((artist) => {
            res.render(path.join(__dirname, "/views/artists.hbs"), { artist: artist })
        }).catch((err) => {
            res.render(path.join(__dirname, "/views/artists.hbs"), { errorMessage: err })
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.get("/artist-manage/artists", ensureLogin, async function (req, res) {
    try {
        api.getAllArtistsWithUserID(req.session.user.userID).then((artist) => {
            res.status(200).json({ artist: artist });
        }).catch((err) => {
            res.status(503).json({ err: err });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.post("/artist-manage/update", ensureLogin, multer({ storage: artistDocumentStorage }).single('albumImage'), async function (req, res) {
    try {
        api.updateArtist(req.body).then(() => {
            res.status(200).json({ message: "update success" });
        }).catch((err) => {
            console.log(err)
            res.status(503).json({ message: "update failed" })
            console.log(req.body)
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});
app.delete("/artist-manage/:id", ensureLogin, async function (req, res) {
    try {
        const id = req.params.id;
        api.deleteArtist(id).then(() => {
            res.status(200).json({ message: "delete success" });
        }).catch((err) => {
            console.log(err)
            res.status(503).json({ error: "delete failed" })
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
});


// finance management page
app.get("/finance-manage", ensureLogin, async function (req, res) {
    res.render(path.join(__dirname, "/views/comingSoon.hbs"))
});
// analytics manage page 
app.get("/analytics-manage", ensureLogin, async function (req, res) {
    res.render(path.join(__dirname, "/views/comingSoon.hbs"))
});
// you tube request page
app.get("/you-tube-req", ensureLogin, async function (req, res) {
    res.render(path.join(__dirname, "/views/comingSoon.hbs"))
});


// User Login, register

// Don't Touch Logic without Permission
app.get('/profile', function (req, res) {
    res.render(path.join(__dirname, "/views/profile.hbs"))
});
app.get('/login', function (req, res) {
    res.render(path.join(__dirname, "/views/login.hbs"))
});
app.get('/register', function (req, res) {
    res.render(path.join(__dirname, "/views/register.hbs"))
});
app.post('/register', (req, res, next) => {
    try {
        api.registerUser(req.body).then(() => {
            res.render(path.join(__dirname, "/views/register.hbs"), { successMessage: "Registration Successful click for login " });
        }).catch((err) => {
            console.error(err)
            res.render(path.join(__dirname, "/views/register.hbs"), { errorMessage: err, userName: req.body.email });
        })
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: err });
    }
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
const initialzation = process.argv[2];
if (initialzation == "true") {
    api.initializeDatabase().then(() => {
        console.log("database initialized")
    }).catch(() => {
        console.log("unable to initiliaze db")
    })
}
api.connectWithDB().then(() => {
    api.connectMongoDB().then(() => {
        console.log("Mongo Db Connected")
        app.listen(HTTP_PORT)
        console.log("server is listening at port 8080")
    }).catch((err) => {
        console.log("Mongo Db Connection ERR :", err)
    })
}).catch((err) => {
    console.error("err", err)
})