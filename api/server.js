require('dotenv').config()
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors')
const path = require("path")
const jwt = require('jsonwebtoken');
const app = express();
const secret = "DawidKosieradzki"
const port = process.env.PORT || 8080
const books = [
    { tytul: "ferdydurke", autor: "Witold Gombrowicz", dueDate: Date.now() + 24 * 3600 },
    { tytul: "tango", autor: "Sławomir Mrożek", dueDate: Date.now() + 24 * 3600 },
    { tytul: "pan tadeusz", autor: "Adam Mickiewicz", dueDate: -1 }
]
function generateAccessToken(username) {
    return jwt.sign(username, secret);
}
const booksModel = require('./models/book')
const userModel = require("./models/user")
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')))

const mongoose = require('mongoose')
mongoose.connect("dblink", { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to Database"))

app.post('/login', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({})

    }
    const query = await userModel.findOne({ username: req.body.username }).exec();

    if (query == null) {
        return res.status(404).json({})

    } else {
        bcrypt.compare(req.body.password, query.password, function (err, result) {
            if (result) {
                return res.json({
                    token: generateAccessToken({ username: req.body.username }),
                    role: query.role,
                    username: req.body.username
                });
            } else {
                return res.status(403).json({})
            }
        });
    }
});
app.get('/test', async (req, res) => {
    const keys = await booksModel.find()
    res.json(keys)
});
app.post('/register', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({})

    }
    const query = await userModel.findOne({ username: req.body.username }).exec();
    if (query == null) {
        bcrypt.hash(req.body.password, 10, async function (err, hash) {
            // Store hash in your password DB.
            const newUser = new userModel({
                username: req.body.username,
                password: hash,
            })
            const saveNewKey = await newUser.save()
            return res.status(201).json(saveNewKey)
        });
    } else {
        return res.status(400).json({})
    }


});
app.post('/addbook', async (req, res) => {
    const newUser = new booksModel({
        author: req.body.author,
        title: req.body.title,
    })
    const saveNewBook = await newUser.save()
    return res.status(201).json(saveNewBook)
});
app.post('/searchbook', async (req, res) => {
    const tempBooks = await booksModel.find()
    let tempArr = []
    for (let book of tempBooks) {
        if (book.title.toUpperCase().includes(req.body.data.toUpperCase()) || book.author.toUpperCase().includes(req.body.data.toUpperCase()) || book["_id"] == req.body.data) {
            tempArr.push(book)
        }
    }
    res.json(tempArr)
});
app.get('/user/:id', async (req, res, next) => {
    const tempBooks = await booksModel.find()
    let tempArr = []
    for (let book of tempBooks) {
        if (book.owner == req.params.id) {
            tempArr.push(book)
        }
    }
    res.json(tempArr)
})
app.get('/outdatedbooks', async (req, res, next) => {
    const tempBooks = await booksModel.find()
    let tempArr = []
    for (let book of tempBooks) {
        if (book.startDate + 30 * 1000 * 3600 * 24 < Date.now() && book.startDate != -1) {
            tempArr.push(book)
        }
    }
    res.json(tempArr)
})
app.post('/removereservation', async (req, res) => {
    await booksModel.findOneAndUpdate({ "_id": req.body.id }, { owner: null, startDate: -1 });
    return res.json({})
});
app.post('/reserve', async (req, res) => {
    await booksModel.findOneAndUpdate({ "_id": req.body.id }, { owner: req.body.owner, startDate: Date.now() });
    return res.json({})
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.listen(port, () => console.log(`API is running on port ${port}`));
