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
app.patch('/update-book', async(req, res) =>{
    const { original_book, new_book } = req.body
    try{
        const result = await updateBook(original_book, new_book)
        if(result.stack && result.message || result instanceof Error){
            return res.status(400).json({ success: false, message: result.message})
        }
        return res.status(200).json({ success: result, message: "Book added successfully. "})
    }catch(e) {
        console.error(e.stack)
        return res.json({ message: e.message, success: false })
    }
    async function updateBook(originalBook, updatedBook) {
        try{
            const doesOriginalExist = await doesBookExist(originalBook);
            if(doesOriginalExist === false){
                return new Error("The book you want to update does not exist in Library.")
            }
            const isUpdatedBookInLibrary = await doesBookExist(updatedBook)
            if(isUpdatedBookInLibrary === true) {
                return new Error("The book title you are updating to already exists.")
            }
            if(doesOriginalExist === true && isUpdatedBookInLibrary === false) {
                const indexToReplace = Library.indexOf(original_book)
                Library.splice(indexToReplace,1,updatedBook)
                return true
            }
        }catch(e) {
            console.error(e.stack)
            return new Error("There was a system problem.")
        }
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