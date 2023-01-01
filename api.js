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
        mongo.initialize().then(()=>{
            resolve("connected")
        }).catch((err)=>{
            reject("failed with err:",err)
        })
      }).catch((err)=>{
        reject("failed with err:",err)
      })
   })
}


// APIS return promises

function getAllAlbumsForUser(userID){

}
function getAllSongsForAlbum(albumID){

}
function authenticateUser(username,password){

}
function getAllLabelsForUser(userID){
    return db.getAllLabels(userID)
}
function addLabelForUserWithID(labelData,userID){
        label ={
            "title" : labelData.title,
            "userID":userID,
            "youtubeLink":labelData.youtube,
            "noObjectionFile":labelData.filename
        }
        return db.addLabelForUser(label)
}
// run the query to get all albums which are mentioned draft = false and related to userID
function getDraftAlbumsForUser(userID){

}
function getNews(){

}
function getPaymentInfoForUserID(userID){

}
// run the query to get all albums which are mentioned approved = false and related to userID
function getNonApprovedAlbums(userID){

}
function getPrimaryArtistForUserID(userID){

}
function getUserInfo(userID){
  
}
function editUserInfo(){

}
function deleteUser(){

}
function editAlbum(){

}
function deleteAblum(){

}
function deleteLabel(){

}
function albumApproved(albumID){

}
// draft = false store for albumID
function removeDraft(albumID){
    
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
module.exports = {connectWithDB,initializeDatabase,getAllAlbumsForUser,registerUser,login,addLabelForUserWithID,getAllLabelsForUser}