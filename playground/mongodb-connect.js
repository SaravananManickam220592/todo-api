// const MongoClient = require('mongodb').MongoClient;

const {MongoClient,ObjectID} = require('mongodb');

var obj=new ObjectID();

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to Connect to Mongo DB server');
    }
    console.log('Connected to Mongo DB server');

    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text : 'First Todo Insert',
    //     completed : false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert Todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //         name : 'Saravanan Manickam',
    //         age : 26,
    //         email : 'sarava220592@gmail.com',
    //         location : 'Chennai'
    //     }, (err, result) => {
    //         if (err) {
    //             return console.log('Unable to insert User', err);
    //         }
    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     });
    
    db.collection('Todos').find().toArray().then((docs)=>{
        console.log('Todos');
        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log('Unable to Fetch Todos', err);
    })

    client.close();
});