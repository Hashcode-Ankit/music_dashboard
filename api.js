// API's to the Frontend
const db = require('./db');
const mongo = require('./mongo');

// db connections
function connectWithDB(){
    return db.connectDb()
}


function initializeDatabase(){
   return new Promise((resolve, reject) => {
      db.initialize().then(()=>{
        resolve("db initialized")
      }).catch((err)=>{
        reject("failed with err:",err)
      })
   })
}
function connectMongoDB(){
  return new Promise((resolve, reject) => {
    mongo.initialize().then(()=>{
        resolve("connected")
    }).catch((err)=>{
        reject("failed with err:",err)
    })
  })  
}

// APIS return promises

function getAllAlbumsForUser(userID){
    return db.getAllAlbums(userID)
}

function getAllSongsForAlbum(albumID){
    return new Promise((resolve,reject)=>{
        db.getAlbum(albumID)
        .then(function(data){
            resolve(data.songs) ;
         }).catch(function(error){
            reject(Error("Unable to get songs from album :",error))
        });
    })
}

function authenticateUser(username,password){

}
function getAllLabelsForUserIDForUser(userID){
    return db.getAllLabelsForUserID(userID)
}
function addLabelForUserWithID(labelData,userID){
        label = {
            "title" : labelData.title,
            "userID":userID,
            "youtubeLink":labelData.youtube,
            "noObjectionFile":labelData.filename
        }
        return db.addLabel(label)
}
function updateLabel(labelData){
    return db.updateLabel(labelData.id,labelData)
}
// run the query to get all albums which are mentioned draft = false and related to userID
function getDraftAlbumsForUser(userID){
    return db.getDraftAlbumsForUser(userID)
}
function getCompletedAlbumsForUser(userID){
    return db.getCompletedAlbumsForUser(userID)
}
function getNews(){

}
function getStores(){
    return new Promise((resolve, reject) => {
        const fs = require("fs");
        fs.readFile("stores.json", (err, data) => {
        if (err) reject (err);
        resolve(JSON.parse(data))
         });
    })
}
function getPaymentInfoForUserID(userID){

}
// run the query to get all albums which are mentioned approved = false and related to userID
function getNonApprovedAlbums(userID){
    return new Promise((resolve,reject)=>{
        db.getAllAlbums(userID)
        .then(function(data){
            let albums = [];
            for(let i=0;i<data.length;i++){
                if(!data.approved){
                    albums.push(data[i]);
                }
            }
            resolve(albums)
        }).catch((error)=>{
            reject(Error("Unable to get albums from postgres",error))
        })
    })
}

function getPrimaryArtistForUserID(userID){
    return new Promise((resolve,reject)=>{
        db.getAlbum(userID)
        .then((data)=>{
            resolve(data.primaryArtistName)
        }).catch((error)=>{
            reject(Error("Unable to get primary artist from postgres", error))
        })
    })
}
function getUserInfo(userID){
  
}
function editUserInfo(){

}
function deleteUser(){

}

function saveAlbum(albumData){
    album = {
        "title":albumData.title,
        "subTitle":albumData.subTitle,
        "imageUrl":albumData.imageUrl,
        "primaryArtist":albumData.primaryArtist,
        "actor":albumData.actor,
        "genre":albumData.genre,
        "subGenre":albumData.subGenre,
        "format":albumData.format,
        "labelName":albumData.labelID,
        "originalReleaseDate":albumData.originalReleaseDate,
        "userID":albumData.userID,
        "approved":false,
        "draft" : true
    }
    
    return new Promise((resolve, reject) => {
        db.addAlbum(album).then((savedAlbumData)=>{
            let response = {
                "id" : savedAlbumData.id,
                "title": savedAlbumData.title
            }
            saveArtist(albumData.primaryArtist,albumData.userID).then((savedAlbumData)=>{
                resolve(response)
            }).catch((err)=>{
                reject(err)
            }) 
        }).catch((err)=>{
            reject(err)
        })
    })
}

function saveArtist(artistName,userID){
    artist = {
        "name":artistName,
        "userID":userID
    }
    return db.addArtist(artist)
}
function updateArtist(artist){
    return db.updateArtist(artist.id,artist)
}
function deleteArtist(id){
    return db.deleteArtist(id)
}
function saveSongData(songData){
    var song = {
       "userID" : songData.userID,
       "albumID": songData.albumID,
       "writer" : songData.writer,
       "director": songData.director,
       "composer": songData.composer,
       "producer": songData.producer,
       "parent" : songData.parent,
       "isrc": songData.isrc,
       "language": songData.language,
       "lyrics": songData.lyrics,
       "tiktok": songData.tiktok,
       "filePath" : songData.filePath
    }
    console.log("data of song to store : ",song)
    return new Promise((resolve, reject) => {
        db.addSong(song).then((data)=>{
            resolve(data.id)
        }).catch((err)=>{
            reject(err)
        })
    })
}
function updateSongData(songData){
    var song = {
       "userID" : songData.userID,
       "albumID": songData.albumID,
       "writer" : songData.writer,
       "director": songData.director,
       "composer": songData.composer,
       "producer": songData.producer,
       "parent" : songData.parent,
       "isrc": songData.isrc,
       "language": songData.language,
       "lyrics": songData.lyrics,
       "tiktok": songData.tiktok,
       "filePath" : songData.filePath
    }
    console.log("data of song to update : ",song)
    return db.updateSong(song,songData.songIDInDB)
}
function updateSongsArrayInAlbum(songArray){
    return db.updateSongArrayOfAlbum(songArray)
}
function addSongForUser(songData, userID, AlbumID){
    return db.addSong(songData)
}
function getAllArtistsWithUserID(userID){
    return db.getArtistForUser(userID)
}
function updateAlbum(albumData){
    album = {
        "title":albumData.title,
        "subTitle":albumData.subTitle,
        "imageUrl":albumData.imageUrl,
        "primaryArtist":albumData.primaryArtist,
        "actor":albumData.actor,
        "genre":albumData.genre,
        "subGenre":albumData.subGenre,
        "format":albumData.format,
        "labelName":albumData.labelID,
        "originalReleaseDate":albumData.originalReleaseDate,
        "userID":albumData.userID,
        "approved":false,
        "draft" : true
    }
   return new Promise((resolve, reject) => {
    db.updateAlbum(albumData.albumId,album).then((savedAlbumData)=>{
        let response = {
            "id" : savedAlbumData.id,
            "title": savedAlbumData.title
        }
        saveArtist(albumData.primaryArtist,albumData.userID).then((savedAlbumData)=>{
            resolve(response)
        }).catch((err)=>{
            reject(err)
        }) 
    }).catch((err)=>{
        reject(err)
    })
   })
}
function updateToCompletedAlbum(album){
   return db.migrateToCompleted(album)
}
function updateStoresArrayInAlbum(storeArray){
    return db.updateStoresArrayInAlbum(storeArray)
}
function deleteAblum(albumId){
    return db.deleteAlbum(albumId)
}

function deleteLabel(labelId,userID){
    return db.deleteLabel(labelId,userID) 
}

function albumApproved(albumID){
    return new Promise((resolve,reject)=>{
        db.getAlbum(albumID)
        .then((data)=>{
            if(data.approved){
                resolve(data)
            }
        }).catch((error)=>{
            reject(Error("Album is not approved :",error))
        })
    })
}

// draft = false store for albumID
function removeDraft(albumID){
    return new Promise((resolve,reject)=>{
        db.getAlbum(albumID)
        .then((data)=>{
            if(data.draft){
                data.draft=false
            }
            resolve()
        }).catch((error)=>{
            reject(Error("Unable to remove draft",error))
        })
    })
}

// register 
function registerUser(userData){
    return new Promise((resolve, reject) => {
        if(userData.pass1 != userData.pass2){
            reject("Password does not match");
        }
        mongo.userExist(userData).then(()=>{
            userToStore = {
                "email":userData.email,
                "password":userData.pass1,
                "contact":userData.mobile
             }
            mongo.registerUser(userToStore).then(()=>{
                resolve()
                }).catch((err)=>{
                    reject(err)
                })
        }).catch(()=>{
           reject("user already exist or choose different email")
        })
    })
}
// login
function login(userData){
    return mongo.loginUser(userData)
}
module.exports = {connectWithDB,initializeDatabase,updateLabel,updateToCompletedAlbum, updateStoresArrayInAlbum, getStores, updateSongData,updateSongsArrayInAlbum,getCompletedAlbumsForUser, saveSongData, updateArtist,deleteArtist, getAllAlbumsForUser,getAllSongsForAlbum,getDraftAlbumsForUser,getNonApprovedAlbums,getPrimaryArtistForUserID,registerUser,deleteAblum,deleteLabel,albumApproved,removeDraft,login,addLabelForUserWithID,saveArtist,getAllLabelsForUserIDForUser,saveAlbum,connectMongoDB, getAllArtistsWithUserID, addSongForUser,updateAlbum}
