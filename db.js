// DB Interactions CRUD returns promises only and file exposed to api only 

const { decodeBase64 } = require('bcryptjs');
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
const connectDb = async() => {
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
        userID: {
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
            type: Sequelize.STRING,
        },
        facebookUrl: {
            type: Sequelize.STRING,
        }
    })
    // Song Model
var Song = sq.define('Song', {
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
    albumId: {
        type: Sequelize.INTEGER,
    },
    writer: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    composer: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    director: {
        type: Sequelize.STRING,
    },
    producer: {
        type: Sequelize.STRING,
    },
    isrc: {
        type: Sequelize.STRING,
    },
    parent: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    language: {
        type: Sequelize.STRING,
    },
    lyrics: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    tiktok: {
        type: Sequelize.STRING,
    },
    filePath: {
        type: Sequelize.STRING,
        allowNull: false,
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
        where: {
            userID: userID
        }
    })
}

function getDraftAlbumsForUser(userID) {
    return Album.findAll({
        where: {
            userID: userID,
            draft: true,
        }
    })
}

function getCompletedAlbumsForUser(userID) {
    return Album.findAll({
        where: {
            userID: userID,
            draft: false,
        }
    })
}

function getPendingAlbumsForAdmin() {
    return Album.findAll({
        where: {
            draft: false,
            approved: false,
        }
    })
}

function getApprovedAlbumsForAdmin() {
    return Album.findAll({
        where: {
            draft: false,
            approved: true,
        }
    })
}


//get an Album
function getAlbum(albumId) {
    return Album.findAll({
        where: { id: albumId }
    })
}

async function approveAlbum(albumId) {
    await Album.update({ approved: true }, { where: { id: albumId } })
    console.log("Approved Successfully")
    console.log(await Album.findAll({
        where: { id: albumId }
    }))
}

async function rejectAlbum(albumId) {
    await Album.update({ approved: false, draft: true }, { where: { id: albumId } })
    console.log("rejected Successfully")
    console.log(await Album.findAll({
        where: { id: albumId }
    }))
}

// create an album
function addAlbum(albumData) {
    return Album.create(albumData)
}

function addSong(songData) {
    return Song.create(songData)
}

function updateSong(songData, songID) {
    return Song.update(songData, {
        where: {
            id: songID,
        }
    })
}

function updateSongArrayOfAlbum(songArray) {
    return Album.update({ songs: songArray.songs }, {
        where: {
            id: songArray.albumID,
            userID: songArray.userID
        }
    })
}

function updateStoresArrayInAlbum(storeArray) {
    return Album.update({ stores: storeArray.stores }, {
        where: {
            id: storeArray.albumID,
            userID: storeArray.userID
        }
    })
}
//update an Album
function updateAlbum(albumId, updateInfo) {
    return Album.update(updateInfo, {
        where: { id: albumId }
    })
}

function migrateToCompleted(album) {
    return Album.update({ draft: false }, {
        where: {
            id: album.albumID,
            userID: album.userID
        }
    })
}

//delete an Album
function deleteAlbum(albumId, userID) {
    return Album.destroy({
        where: { id: albumId, userID: userID }
    })
}


//create a label
function addLabel(labelData) {
    return Label.create(labelData)
}

function getAllSongForUser(userID) {
    return Song.findAll({
        where: { userID: userID }
    })
}

function getAllSongsForAlbum(albumID) {
    return Song.findAll({
        where: { albumId: albumID }
    })
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
    return Label.update(updateInfo, {
        where: {
            id: labelId,
        }
    })
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
function getArtistForUser(userID) {
    return Artist.findAll({
        where: { userID: userID }
    })
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
function updateArtist(artistId, artist) {
    return Artist.update(artist, {
        where: { id: artistId }
    })
}

//delete an artist
function deleteArtist(artistId) {
    return Artist.destroy({
        where: {
            id: artistId,
        }
    })
}


module.exports = { connectDb, initialize, getAllSongForUser, getAllSongsForAlbum, migrateToCompleted, updateSong, updateStoresArrayInAlbum, addAlbum, getDraftAlbumsForUser, getCompletedAlbumsForUser, getPendingAlbumsForAdmin, getApprovedAlbumsForAdmin, addSong, updateSongArrayOfAlbum, getAllAlbums, deleteAlbum, updateAlbum, getAlbum, addLabel, getAllLabelsForUserID, getLabel, updateLabel, deleteLabel, getArtist, addArtist, updateArtist, deleteArtist, getArtistForUser, approveAlbum, rejectAlbum }