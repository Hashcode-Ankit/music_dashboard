// API's to the Frontend
const db = require('./db');


// db connections
function connectWithDB(){
    return db.connectDb()
}
function initializeDatabase(){
    return db.initialize()
}


// APIS return promises

function getAllAlbumsForUser(userID){
    return new Promise((resolve,reject)=>{
         db.getAllAlbums(userID)
        .then(function(data){
          resolve(data) ;
       }).catch(function(error){
          reject(Error(`Unable to get albums for userId :${userID}`,error))
      });
    })
}

function getAllSongsForAlbum(albumID){
    return new Promise((resolve,reject)=>{
        db.getAlbum(albumID)
        .then(function(data){
            resolve(data.songs) ;
         }).catch(function(error){
            reject(Error("Unable to get a album :",error))
        });
    })
}
function authenticateUser(username,password){

}
function getAllLabelsForUser(userID){
    return new Promise((resolve,reject)=>{
        Label.findAll()
        .then(function(data){
            resolve(data);
        }).catch((error)=>{
            reject(Error("Unable to get Labels from postgres",error))
        })
    })
}
// run the query to get all albums which are mentioned draft = false and related to userID
function getDraftAlbumsForUser(userID){
    return new Promise((resolve,reject)=>{
        db.getAllAlbums(userID)
        .then(function(data){
            let albums = [];
            for(let i=0;i<data.length;i++){
                if(data.draft===false){
                    albums.push(data[i]);
                }
            }
            resolve(albums)
        }).catch((error)=>{
            reject(Error("Unable to get albums from postgres",error))
        })
    })
}
function getNews(){

}
function registerUser(username,password,email,contactInfo){

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
                if(data.approved===false){
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
function editAlbum(){
    return new Promise((resolve,reject)=>{
        db.updateAlbum()
        .then(function(){
            resolve(`album Successfully updated with ${albumId}`)
        }).catch(function(error){
            reject("Unable to update album :",error)
        })
    })
}
function deleteAblum(albumId){
    return new Promise((resolve,reject)=>{
        db.deleteAlbum(albumId)
        .then(()=>{
            resolve(`album deleted successfully ${albumId}`)
        }).catch((error)=>{
            reject("Unable to delete the album :",error)
        })
    })
}
function deleteLabel(labelTitle){
    return new Promise((resolve,reject)=>{
        db.deleteLabel(labelTitle)
        .then(()=>{
            resolve(`label deleted successfully with title ${labelTitle}`)
        }).catch((error)=>{
            reject("Unable to delete the label :",error)
        })
    }) 
}
function albumApproved(albumID){
    return new Promise((resolve,reject)=>{
        db.getAlbum(albumID)
        .then((data)=>{
            resolve(data)
        })
    })
}
// draft = false store for albumID
function removeDraft(albumID){
    
}
module.exports = {connectWithDB,initializeDatabase,getAllAlbumsForUser,getAllSongsForAlbum}