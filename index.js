const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const getData = (fileName) => {
    csv = fs.readFileSync(`data/${fileName}`);
    var array = csv.toString().split('\n');
    let result = [];
    let headers = array[0].split(';').map((item) => item.trim());
    for (let i = 1; i < array.length - 1; i++) {
        let string = array[i].split(';');
        let obj = {};
        for (let j in headers) {
            obj[headers[j]] = string[j];
        }
        result.push(obj);
    }

    return result;
};
const books = getData('books.csv');
const authors = getData('authors.csv');
const magazine = getData('magazine.csv');

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ';';

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    // console.log(str);
    return str;
}

// const convertJsonTocsv = (json) => {
//     var fields = Object.keys(json[0]);
//     var replacer = function (key, value) {
//         return value === null ? '' : value.toString();
//     };
//     var csv = json.map((row) => {
//         return fields
//             .map(function (fieldName) {
//                 return JSON.stringify(row[fieldName], replacer);
//             })
//             .join(';');
//     });
//     csv.unshift(fields.join(';'));
//     csv = csv.join('\r\n');
//     console.log(csv);
// };

const displayFun = (data, filter) => {
    if (filter == 'book') {
        data.map((book) => {
            console.log('Book Title: ', book.title, '\n');
            console.log('Book ISBN: ', book.isbn, '\n');
            console.log("Book's Author's Email : ", book.authors, '\n');
            console.log("Book's Description : ", book.description, '\n');
            console.log('\n\n');
        });
    } else {
        data.map((magazine) => {
            console.log('Magazine Title: ', magazine.title, '\n');
            console.log('Magazine ISBN: ', magazine.isbn, '\n');
            console.log("Magazine's Author's Email : ", magazine.authors, '\n');
            console.log('Magazine Published On : ', magazine.publishedAt, '\n');
            console.log('\n\n');
        });
    }
};

const printAllBooksandMagazine = () => {
    displayFun(books, 'book');
    displayFun(magazine, 'mag');
};
const findBook = (data, filter) => {
    if (filter === 'email') {
        return books.filter((book) => book.authors == data);
    } else {
        return books.filter((book) => book.isbn === data);
    }
};
const findMagazine = (data, filter) => {
    if (filter === 'email') {
        return magazine.filter((mag) => mag.authors == data);
    } else {
        return magazine.filter((mag) => mag.isbn == data);
    }
};

const addBook = (data) => {
    books.push(data);
    let dataToSend = books;
    const header = Object.keys(books[0]);
    dataToSend.unshift(header);
    const output = convertToCSV(JSON.stringify(dataToSend));
    fs.writeFile(`Book:${Date.now()}.csv`, output, (err) => {
        if (err) throw err;
        console.log('csv saved.');
    });
};
const addMag = (data) => {
    magazine.push(data);
    let dataToSend = magazine;
    const header = Object.keys(magazine[0]);
    dataToSend.unshift(header);
    const output = convertToCSV(JSON.stringify(dataToSend));
    fs.writeFile(`Mag:${Date.now()}.csv`, output, (err) => {
        if (err) throw err;
        console.log('csv saved.');
    });
};

const sortByTitle = () => {
    const sortedBooks = books.sort((a, b) => {
        var nameA = a.title.toUpperCase();
        var nameB = b.title.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    const sortedMag = magazine.sort((a, b) => {
        var nameA = a.title.toUpperCase();
        var nameB = b.title.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    displayFun(sortedBooks, 'book');
    displayFun(sortedMag, 'mag');
};

const rl = readline.createInterface({ input, output });
const askQuestion = (question) => {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            // console.log(`Thank you for your valuable feedback: ${answer}`);
            resolve(answer);
        });
    });
};

rl.question(
    "What do you want to do with the data\n\
            1.Print Out All Books And Magazines\n\
            2.Find Book By ISBN\n\
            3.Find Magazine By ISBN\n\
            4.Find Book By Author's Email\n\
            5.Find Magazine By Author's Email\n\
            6.Sort Book & Magazine by Title \n\
            7.Add Book \n\
            8.Add Magazine \n",
    async (answer) => {
        // getSwitch(answer);
        switch (parseInt(answer)) {
            case 1:
                printAllBooksandMagazine();
                break;
            case 2:
                const num = await askQuestion('Enter Book ISBN ');
                displayFun(findBook(num, 'ISBN'), 'book');
                break;
            case 3:
                const magNum = await askQuestion('Enter Magazine ISBN ');

                displayFun(findMagazine(magNum, 'ISBN'), 'mag');
                break;
            case 4:
                const bookAuthorEmail = await askQuestion(
                    "Enter Book's Author "
                );
                displayFun(
                    findBook(bookAuthorEmail.toLowerCase(), 'email'),
                    'book'
                );
                break;
            case 5:
                const magAuthMail = await askQuestion(
                    "Enter Magazine's Author "
                );
                displayFun(
                    findMagazine(magAuthMail.toLowerCase(), 'email'),
                    'mag'
                );
                break;
            case 6:
                sortByTitle();
                break;
            case 7:
                console.log('7 called');
                const bookTitle = await askQuestion('Enter Book Title ');
                const bookISBN = await askQuestion('Enter Book ISBN ');
                const bookAuthor = await askQuestion('Enter Book Author ');
                const bookDesc = await askQuestion('Enter Book Description ');
                addBook({
                    bookTitle,
                    bookISBN,
                    bookAuthor,
                    bookDesc,
                });

                break;

            case 8:
                // console.log('7 called');
                const magTitle = await askQuestion('Enter Magazine Title ');
                const magISBN = await askQuestion('Enter Magazine ISBN ');
                const magAuthor = await askQuestion('Enter Magazine Author ');
                const magDesc = await askQuestion(
                    'Enter Magazine Description '
                );
                addMag({
                    magTitle,
                    magISBN,
                    magAuthor,
                    magDesc,
                });
                break;
            default:
                console.log('enter valid number');
        }
        rl.close();
    }
);
