const express = require("express");
const cors = require("cors");
const bp = require("body-parser");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(bp.json());
app.use(bp.urlencoded({extended: true}));
app.use(cors());

const Library = [];
app.post('/add-book-to-library', async(req, res) =>{
    const { book } = req.body
    try {
        const result = await addBook(book)
        if(result.stack && result.message || result instanceof Error){
            return res.status(400).json({ success: false, message: result.message})
        }
        console.log(Library)
        return res.status(200).json({success: true, message: "Book added successfully."});
    }catch(e) {
        console.error(e.stack)
        return res.status(400).json({ message: e.message })
    }
    async function addBook(book) {
        const isNewBook = await doesBookExist(book, Library)
        if(isNewBook === false) {
            Library.push(book);
            return Library.find(bookTitle => bookTitle === book);
        } else {
            return new Error('Book already exists, please add a new book.')
        }
    }
})
app.delete('/delete-from-library', async(req, res) =>{
    const { book } = req.body;
    try {
        const result = await removeBook(book);
        if(result.stack && result.message || result instanceof Error){
            return res.status(400).json({ success: false, message: result.message})
        }
        return res.status(200).json({ message: "Successfully removed book.", success: result })
    } catch (error) {
        console.error(error)
    }
    async function removeBook(book) {
        const isBookInLibrary = await doesBookExist(book, Library)
        if(isBookInLibrary === false) {
            return new Error("Book does not exist, please enter a title in our database.")
        } else {
            const indexOfTitle = Library.indexOf(book)
            Library.splice(indexOfTitle, 1)
            return true
        }
    }
})
app.put('/addProducts', async(req, res) =>{

})
app.put('/removeProducts', async(req, res) =>{
    
})

app.listen(PORT, function () {
    console.log('listen to events on a "port: ', PORT)
});

async function doesBookExist(newBook) {
    try {
        console.log(newBook, "Book to add")
        const isBookInLibrary = Library.find(book => book === newBook)
        console.log(isBookInLibrary, "this is the existance of the boook")
        if(isBookInLibrary == null) return false
        return true 
    }catch(e) {
        console.error(e.message)
    }
} 