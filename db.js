// DB Interactions CRUD returns promises only and file exposed to api only 

const { info } = require('console');
const Sequelize = require('sequelize');


var sq = new Sequelize("lgvgdkwm","lgvgdkwm","xYf3IfZ9q1ibCxxU4jaesoLg0mIJV_tv",{
    host: "rosie.db.elephantsql.com",
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});



//Db Connection
const connectDb = async ()=>{
    return await sq.authenticate()
}


// Album model
var Album = sq.define('Album', {
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique:true,
        primaryKey:true,
    },
    userID:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    releaseTitle:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    draft:{
        type:Sequelize.BOOLEAN,
    },
    approved:{
        type:Sequelize.BOOLEAN,
    },
    imageUrl:{
        type:Sequelize.STRING,
    },
    primaryArtistName:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    actor:{
        type:Sequelize.STRING,
    },
    genre:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    subgenre:{
        type:Sequelize.STRING,
    },
    labelName:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    format:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    originalReleaseDate:{
        type:Sequelize.DATEONLY,
        allowNull:false,
    },
    publisherCopyright:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    copyright:{
        type:Sequelize.STRING,
        required:true,
    },
    productionYear:{
        type:Sequelize.INTEGER,
        required:true,
    },
    producerCatalogueNumber:{
        type:Sequelize.STRING,
        required:true,
    },
    songs:{
        type:Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue:[],
    },
    stores:{
        type:Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue:[],
    }
})
//Label model
var Label = sq.define('Label',{
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    title:{
        type:Sequelize.STRING,
        unique:true,
    },
    userID:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    youtubeLink:{
        type:Sequelize.STRING,
    },
    approved:{
        type:Sequelize.BOOLEAN,
    },
    noObjectionFile:{
        type:Sequelize.STRING
    } 
})

// After connecting  and defining models initialize the db 

//Artist model
var Artist = sq.define('Artist',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull: false,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    instagramId:{
        type:Sequelize.STRING,
    },
    spotifyId:{
        type:Sequelize.STRING,
    },
    appleId:{
        type:Sequelize.INTEGER,
    },
    facebookUrl:{
        type:Sequelize.STRING,
    },
    wynkId:{
        type:Sequelize.INTEGER,
    },
    action:{
        type:Sequelize.STRING
    }
})

function initialize(){
    return new Promise((resolve,reject)=>{
     setTimeout(()=>{
         sq.sync({ force: true }).then(()=> {
            resolve("Postgres Database Successfully initialized");
         }).catch((err)=> {
             reject("Unable to initialize Postgres Database check schema of tables",err)
         });   
     },3000)
     
 })
 }

// get all Albums 
function getAllAlbums(userID){
    return new Promise((resolve,reject)=>{
        Album.findAll({
            where:{
                userID:userID,
            }
        }).then(function(data){
            resolve(data);
        }).catch(function(error){
            reject(Error("Unable to get songs from postgres :",error))
        })
    })
}

//get an Album
function getAlbum(albumId){
    return new Promise((resolve,reject)=>{
        Album.findAll({
            where:{
                id:albumId,
            }
        }).then(function(data){
          resolve(data) ;
       }).catch(function(error){
          reject(Error("Unable to get a album :",error))
      });
    })
}


// create an album
function addAlbum(albumData){
    return new Promise((resolve,reject)=>{
        Album.create({albumData})
        .then(function(){
            resolve("album added successfully")
        }).catch(function(error){
            reject("Unable to add album :",error)
        })
    })  
}

//update an Album
function updateAlbum(albumId, updateInfo ){
    return new Promise((resolve,reject)=>{
        Album.update({updateInfo},
            {
                where: { 
                    id: albumId 
                }
            }
        ).then(function(){
            resolve(`album Successfully updated with ${albumId}`)
        }).catch(function(error){
            reject("Unable to update album :",error)
        })
    })
}

//delete an Album
function deleteAlbum(albumId){ 
    return new Promise((resolve,reject)=>{
        Album.destroy({
            where:{
                id:albumId,
            }
        }).then(()=>{
            resolve(`album deleted successfully ${albumId}`)
        }).catch((error)=>{
            reject("Unable to delete the album :",error)
        })
    })  
}


//create a label
function addLabel(labelData){
    return new Promise((resolve,reject)=>{
        Label.create({labelData})
        .then(()=>{
            resolve("label added successfully")
        }).catch((error)=>{
            reject("Unable to add label :",error)
        })
    }) 
}

//add label for user
function addLabelForUser(){

}

//get all labels
function getAllLabels(userID){
    return new Promise((resolve,reject)=>{
        Label.findAll({
            where:{
                id:userID
            }
        }).then(function(data){
            resolve(data);
        }).catch((error)=>{
            reject(Error("Unable to get Labels from postgres",error))
        })
    })
}

//get a label
function getLabel(labelId){
    return new Promise((resolve,reject)=>{
        Label.findAll({
            where:{
                id:labelId,
            }
        }).then(function(data){
          resolve(data) ;
       }).catch(function(error){
          reject(Error("Unable to get a label :",error))
      });
    })
}

//update a label
function updateLabel(labelId, updateInfo ){
    return new Promise((resolve,reject)=>{
        Album.update({updateInfo},
            {
                where: { 
                    id:labelId,
                }
            }
        ).then(function(){
            resolve(`label Successfully updated with id ${labelId}`)
        }).catch(function(error){
            reject("Unable to update label :",error)
        })
    })
}


//delete a label
function deleteLabel(labelId){ 
    return new Promise((resolve,reject)=>{
        Album.destroy({
            where:{
                id:labelId,
            }
        }).then(()=>{
            resolve(`label deleted successfully with id ${labelId}`)
        }).catch((error)=>{
            reject("Unable to delete the label :",error)
        })
    })  
}

//get all artists
function getAllArtists(){
    return new Promise((resolve,reject)=>{
        Artist.findAll().then(function(data){
            resolve(data);
        }).catch(function(error){
            reject(Error("Unable to get artists from postgres :",error))
        })
    })
}


//get a artist
function getArtist(artistId){
    return new Promise((resolve,reject)=>{
        Label.findAll({
            where:{
                id:artistId,
            }
        }).then(function(data){
          resolve(data) ;
       }).catch(function(error){
          reject(Error("Unable to get an artist :",error))
      });
    })
}


//create an artist
function addArtist(artistData){
    return new Promise((resolve,reject)=>{
        Label.create({artistData})
        .then(()=>{
            resolve("artist added successfully")
        }).catch((error)=>{
            reject("Unable to add artist :",error)
        })
    }) 
}


//update an artist
function updateArtist(artistId, updateInfo ){
    return new Promise((resolve,reject)=>{
        Album.update({updateInfo},
            {
                where: { 
                    id:artistId,
                }
            }
        ).then(function(){
            resolve(`artist Successfully updated with id ${artistId}`)
        }).catch(function(error){
            reject("Unable to update an artist :",error)
        })
    })
}

//delete an artist
function deleteArtist(artistId){ 
    return new Promise((resolve,reject)=>{
        Album.destroy({
            where:{
                id:artistId,
            }
        }).then(()=>{
            resolve(`artist Successfully updated with id ${artistId}`)
        }).catch((error)=>{
            reject("Unable to delete an artist :",error)
        })
    })  
}


module.exports = {connectDb,initialize,addAlbum,getAllAlbums,deleteAlbum,updateAlbum,getAlbum,addLabelForUser,addLabel,getAllLabels,getLabel,updateLabel,deleteLabel,getAllArtists,getArtist,addArtist,updateArtist,deleteArtist}
