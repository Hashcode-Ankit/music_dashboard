// DB Interactions CRUD returns promises only and file exposed to api only 

const { info } = require('console');
const Sequelize = require('sequelize');


var sq = new Sequelize("lgvgdkwm", "lgvgdkwm", "xYf3IfZ9q1ibCxxU4jaesoLg0mIJV_tv", {
    host: "rosie.db.elephantsql.com",
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});



//Db Connection
const connectDb = async () => {
    return await sq.authenticate()
}


// Album model
var Album = sq.define('Album', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    userID: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    subTitle: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    draft: {
        type: Sequelize.BOOLEAN,
    },
    approved: {
        type: Sequelize.BOOLEAN,
    },
    imageUrl: {
        type: Sequelize.STRING,
    },
    primaryArtist: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    actor: {
        type: Sequelize.STRING,
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    subGenre: {
        type: Sequelize.STRING,
    },
    labelName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    format: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    originalReleaseDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    publisherCopyright: {
        type: Sequelize.STRING,
    },
    copyright: {
        type: Sequelize.STRING,
    },
    productionYear: {
        type: Sequelize.INTEGER,
    },
    producerCatalogueNumber: {
        type: Sequelize.STRING,
        required: true,
    },
    songs: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: [],
    },
    stores: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: [],
    }
})
//Label model
var Label = sq.define('Label', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
    },
    title: {
        type: Sequelize.STRING,
    },
    userID: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    youtubeLink: {
        type: Sequelize.STRING,
    },
    approved: {
        type: Sequelize.BOOLEAN,
    },
    noObjectionFile: {
        type: Sequelize.STRING
    }
})

// After connecting  and defining models initialize the db 

//Artist model
var Artist = sq.define('Artist', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    instagramId: {
        type: Sequelize.STRING,
    },
    spotifyId: {
        type: Sequelize.STRING,
    },
    appleId: {
        type: Sequelize.INTEGER,
    },
    facebookUrl: {
        type: Sequelize.STRING,
    },
    wynkId: {
        type: Sequelize.INTEGER,
    },
    action: {
        type: Sequelize.STRING
    }
})

function initialize() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            sq.sync({ force: true }).then(() => {
                resolve("Postgres Database Successfully initialized");
            }).catch((err) => {
                reject("Unable to initialize Postgres Database check schema of tables", err)
            });
        }, 3000)

    })
}

// get all Albums 
function getAllAlbums(userID) {
    return Album.findAll({
        where: { userID: userID }
    })
}

//get an Album
function getAlbum(albumId) {
    return Album.findAll({
        where: { id: albumId }
    })
}


// create an album
function addAlbum(albumData) {
    return Album.create(albumData)
}

//update an Album
function updateAlbum(albumId, updateInfo) {
    return Album.update(updateInfo, {
        where: { id: albumId }
    })
}

//delete an Album
function deleteAlbum(albumId) {
    return Album.destroy({
        where: { id: albumId }
    })
}


//create a label
function addLabel(labelData) {
    return Label.create(labelData)
}


//get all labels
function getAllLabelsForUserID(userID) {
    return Label.findAll({
        where: { userID: userID }
    })
}

//get a label
function getLabel(labelId) {
    return Label.findAll({
        where: {
            id: labelId
        }
    })
}


//update a label
function updateLabel(labelId, updateInfo) {
    return Label.update(updateInfo,
        {
            where: {
                id: labelId,
            }
        }
    )
}


//delete a label
function deleteLabel(labelId, userID) {
    return Label.destroy({
        where: {
            userID: userID,
            id: labelId,
        }
    })
}

//get all artists
function getAllArtists() {
    return Artist.findAll()
}


//get a artist
function getArtist(artistId) {
    return Artist.findAll({
        where: {
            id: artistId,
        }
    })
}


//create an artist
function addArtist(artistData) {
    return Artist.create(artistData)
}


//update an artist
function updateArtist(artistId, updateInfo) {
    return Artist.update(updateInfo,
        {
            where: {
                id: artistId,
            }
        }
    )
}

//delete an artist
function deleteArtist(artistId) {
    return Artist.destroy({
        where: {
            id: artistId,
        }
    })
}


module.exports = { connectDb, initialize, addAlbum, getAllAlbums, deleteAlbum, updateAlbum, getAlbum, addLabel, getAllLabelsForUserID, getLabel, updateLabel, deleteLabel, getAllArtists, getArtist, addArtist, updateArtist, deleteArtist }
