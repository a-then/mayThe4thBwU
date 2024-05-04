const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;


app.set('view engine', 'ejs')



MongoClient.connect('mongodb+srv://ayoslinthen:2LwxSTuY7VajXFdz@cluster0.eocgw7z.mongodb.net/')
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('star-wars-quotes');
        const quotesCollection = db.collection('quotes');

        app.use(bodyParser.urlencoded({ extended: true }))

        app.use(express.static('public'))
        app.use(bodyParser.json())

        //read
        app.get('/', (req, res) => {
            db.collection('quotes')
                .find()
                .toArray()
                .then(results => {
                    // console.log("quotes entered", results)
                    res.render('index.ejs', {quotes: results})

                })
                .catch(error => console.error(error))

                

            // response.sendFile(__dirname + '/index.html')
        })

        // create
        app.post('/quotes', (req, res) => {
            quotesCollection
                .insertOne(req.body)
                .then(result => {
                    // console.log(result)
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        //update
        app.put('/quotes', (req, res) => {
            // console.log(req.body)
            quotesCollection
                .findOneAndUpdate({name:'yoda'}, 
                    { $set: {
                        name:req.body.name,
                        quote: req.body.quote,
                      },
                    }, 
                    { upsert: true,}
                )
                .then(result => {
                    res.json('Success');
                })
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection
                .deleteOne({ name: req.body.name })
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                      }
                      res.json(`Deleted Darth Vader's quote`)
                    })
                    .catch(error => console.error(error))
        })
    

        app.listen(3000, () => {
            console.log('listening on 3000');
        })


    })
    .catch(error => console.error(error));




console.log('May node be with you');