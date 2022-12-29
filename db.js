// DB Interactions CRUD


const Sequelize = require('sequelize');


var sequelize = new Sequelize(process.env.database,process.env.user,process.env.password,{
    host: process.env.host,
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
        console.log("Postgres connection failed :",err);
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
        type:Sequelize.BOOLEAN
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
    }
})


async function initialize(){
    return await sequelize.sync().then(()=> {
        console.log("Postgres Database Successfully initialized");
    }).catch(()=> {
        console.log("Unable to initialize Postgres Database check username and password");
    });
}



//get all Albums 
async function getAllAlbums(){
    return await Album.findAll()
    .catch((err)=>{
        console.log("unable to get songs from postgres",err)
    })
}


//get an Album
async function getAlbum(albumId){
    return await Album.findAll(
        {
            where:{
                id:albumId
            }
        }
    ).catch((err)=>{
        console.log("Unable to get a album",err)
    })
}


// create an album
async function addAlbum(){
    return await Album.create({
    }).then((album)=>{
        console.log("album added successfully")
    }).catch((err)=>{
        console.log("Unable to add album ",err)
    })    
}

//update an Album
async function updateAlbum(albumId, updateInfo ){
    return await Album.update({updateInfo},
        {
        where: { id: albumId }
        }
    ).then((data)=>{
        console.log(`album Successfully updated with ${albumId}`)
    }).catch((err)=>{
        console.log("Unable to update album id :",err,albumId)
    })
}

//delete an Album
async function deleteAlbum(albumId){
    return await Album.destroy({
        where:{
            id:albumId,
        }
    }).then((album)=>{
        console.log(`album deleted successfully ${albumId}`)
    }).catch((err)=>{
        console.log("Unable to delete the album id :",err,albumId)
    })    
}

// getAllAlbums()
// deleteAlbum()
// getAlbum()
// updateAlbum()


module.exports = {connectDb,initialize,addAlbum,getAllAlbums,deleteAlbum,updateAlbum,getAlbum}
