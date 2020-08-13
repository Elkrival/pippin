const express = require("express");
const cors = require("cors");
const bp = require("body-parser");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(bp.json());
app.use(bp.urlencoded({extended: true}));
app.use(cors());
const Library = ['test1', 'test2', 'test3'];

app.post('/add-book-to-library', async(req, res) =>{
    const { book } = req.body
    try {
        const result = await addBook(book)
        if(result.stack && result.message || result instanceof Error){
            return res.status(400).json({ success: false, message: result.message})
        }
        return res.status(200).json({success: true, message: "Book added successfully."});
    }catch(e) {
        console.error(e.stack)
        return res.status(400).json({ message: e.message })
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
})
app.patch('/update-book', async(req, res) =>{
    const { original_book, new_book } = req.body
    try{
        const result = await updateBook(original_book, new_book)
        if(result.stack && result.message || result instanceof Error){
            return res.status(400).json({ success: false, message: result.message})
        }
        return res.status(200).json({ success: result, message: "Book title updated successfully. "})
    }catch(e) {
        console.error(e.stack)
        return res.json({ message: e.message, success: false })
    }
})
app.get('/get-books', async(req, res) =>{
    const callback = function (object){
        return object
    }
    try{
        const result = getBookList(Library, 0, callback)
        return res.status(200).json({ data: result, success: true })
    }catch(e) {
        console.error(e.message)
    }
})
app.put('/book-to-database', async(req, res) =>{
    const responseObject = {}
    const callback = (name, key) => {
        console.log("Book added to database.")
        responseObject[name] = Math.floor(key)
    }
    try{
        for (let index = 0; index < Library.length; index++) {
            const bookTitle = Library[index];
            saveItemToDatabase(bookTitle, callback)
        }
        return res.status(200).json(responseObject)
    }catch(e){
        console.error(e.stack);
    }
})
app.listen(PORT, function () {
    console.log('listen to events on a "port: ', PORT)
});
async function addBook(book) {
    const isNewBook = await doesBookExist(book, Library)
    if(isNewBook === false) {
        Library.push(book);
        return Library.find(bookTitle => bookTitle === book);
    } else {
        return new Error('Book already exists, please add a new book.')
    }
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
async function updateBook(originalBook, updatedBook) {
    try{
        const doesOriginalExist = await doesBookExist(originalBook, Library);
        if(doesOriginalExist === false){
            return new Error("The book you want to update does not exist in Library.")
        }
        const isUpdatedBookInLibrary = await doesBookExist(updatedBook, Library)
        if(isUpdatedBookInLibrary === true) {
            return new Error("The book title you are updating to already exists.")
        }
        if(doesOriginalExist === true && isUpdatedBookInLibrary === false) {
            const indexToReplace = Library.indexOf(originalBook)
            Library.splice(indexToReplace,1,updatedBook)
            return true
        }
    }catch(e) {
        console.error(e.stack)
        return new Error("There was a system problem.")
    }
}
function getBookList(list,index,callback) {
    callback({result: "" });
    if (index === list.length)
       return callback.result;
    else{
       callback.result = callback.result == null || callback.result === "" 
       ? list[index] : callback.result + "|" + list[index] 
       return getBookList(list, index + 1, callback);
    }
 }
 function saveItemToDatabase(name, callback) {
    const timerLength = Math.random(name.length) * 1000
    setTimeout(() =>{
        }, timerLength)
    callback(name, timerLength)
}
async function doesBookExist(newBook, bookList) {
    try {
        const isBookInLibrary = bookList.find(book => book === newBook)

        if(isBookInLibrary == null) return false
        return true 
    }catch(e) {
        console.error(e.message)
    }
} 