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

}
function getAllSongsForAlbum(albumID){

}
function authenticateUser(username,password){

}
function getAllLabelsForUser(userID){

}
// run the query to get all albums which are mentioned draft = false and related to userID
function getDraftAlbumsForUser(userID){

}
function getNews(){

}
function registerUser(username,password,email,contactInfo){

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
module.exports = {connectWithDB,initializeDatabase,getAllAlbumsForUser}