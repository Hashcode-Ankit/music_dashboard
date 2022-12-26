// DB Interactions CRUD

const Sequelize = require('sequelize');

var sequelize = new Sequelize('lgvgdkwm','lgvgdkwm','xYf3IfZ9q1ibCxxU4jaesoLg0mIJV_tv',{
    host: 'rosie.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

//Db Connection
const connectDb = async ()=>{
    return await sequelize
    .authenticate()
    .then(()=>{
        console.log('Connection has established successfully');
    })
    .catch((err)=>{
        console.log(err);
    })
}

// Album model
var Album = sequelize.define('Album', {
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        unique:true,
        primaryKey:true,
    },
    ReleaseTitle:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    draft:{
        type:Sequelize.STRING
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
        type:Sequelize.INTEGER,
        required:true,
    }
})


async function initialize(){
    return await sequelize.sync().then(()=> {
        console.log("Connected")
    }).catch(()=> {
        reject("Unable to Sync to the Database")
    });
}


//get all songs 
async function getAllSongs(){
    return await Album.findAll()
    .catch((err)=>{
        console.log(err)
    })
}


//get a song
async function getSong(songId){
    return await Album.findAll(
        {
            where:{
                id:songId
            }
        }
    ).catch((err)=>{
        console.log(err)
    })
}


// create a song 
async function addSong(){
    return await Album.create({
    }).then((song)=>{
        console.log("Successfully added")
    }).catch((err)=>{
        console.log(err)
    })    
}

//update a song
async function updateSong(songId, updateInfo ){
    return await Album.update({updateInfo},
        {
        where: { id: songId }
        }
    ).then((data)=>{
        console.log(`Successfully updated ${songId}`)
    }).catch((err)=>{
        console.log(err)
    })
}

//delete a song
async function deleteSong(songId){
    return await Album.destroy({
        where:{
            id:songId,
        }
    }).then((song)=>{
        console.log(`deleted successfully ${songId}`)
    }).catch((err)=>{
        console.log(err)
    })    
}

// getAllSongs()
// deleteSong()
// getSong()
// updateSong()


module.exports = {connectDb,initialize,addSong,getAllSongs,deleteSong,updateSong,getSong}
