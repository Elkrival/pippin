const { expect } = require('chai')
let Library;
const responseObject = {};
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

describe('Library', () =>{
    beforeEach(async() =>{
        Library = ['test1', 'test2', 'test3'];
    })
    describe('doesBookExist', () =>{
        it('should verify if a book exist in the library', async() =>{
            const bookExist = await doesBookExist('test1', Library)
            expect(bookExist).to.equal(true)
        })
        it('should return false if book is not in Library', async () =>{
            const bookDoesNotExist = await doesBookExist('test4', Library)
            expect(bookDoesNotExist).to.equal(false)
        })
    })
    describe("addBook", () =>{
        it("should return an error if book already exists", async() =>{
            const error = await addBook('test1');
            expect(error).to.be.an.instanceOf(Error).with.property('message', 'Book already exists, please add a new book.')
        });
        it("should successfully add a book to Library", async () =>{
            const newBook = await addBook('test4');
            expect(newBook).to.equal('test4')
        })
    })
    describe("removeBook", () =>{
        it("should return an error if book does not exist", async() =>{
            const error = await removeBook('test5')
            expect(error).to.be.an.instanceOf(Error).with.property('message', "Book does not exist, please enter a title in our database.")
        });
        it("should remove a book from the Library successfully", async() =>{
            await removeBook("test4")
            const bookIndex = Library.indexOf('test4');
            expect(bookIndex).to.equal(-1)
        })
    })
    describe("updateBook", () =>{
        it("should return an error if book title to update to is part of the list ", async() =>{
            const error = await updateBook('test1', 'test1')
            expect(error).to.be.an.instanceOf(Error).with.property('message', "The book title you are updating to already exists.")
        })
        it("should return an error if book that will be changed does not exist", async() =>{
            const error = await updateBook('test4', 'test');
            expect(error).to.be.an.instanceOf(Error).with.property('message', "The book you want to update does not exist in Library.")
        })
        it("should return true if update is successful", async() =>{
            const updated = await updateBook('test1', 'test');
            expect(updated).to.equal(true)
        })
    })
    describe("getBookBookList", () =>{
        it("should return a string of the book list", (done) =>{
            const bookListCallback = function (object){
                return object
            }
            const stringList = getBookList(Library, 0, bookListCallback)
            expect(stringList).to.be.a('string')
            expect(stringList).to.include('|')
            done()
        })
    })
    describe("saveItemToDatabase", () =>{
        it("should create a response object with book as key and value length of book name", (done) =>{
            const persistenceCallback = (name, key) => {
                responseObject[name] = Math.floor(key)
            }
            for (let index = 0; index < Library.length; index++) {
                const element = Library[index];
                saveItemToDatabase(element, persistenceCallback)
            }
            expect(responseObject).to.have.property('test1')
            expect(responseObject['test1']).to.be.a('number')
            done()
        })
    })
})