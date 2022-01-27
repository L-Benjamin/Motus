// Requires.
const express = require('express');
const {promises: fs} = require("fs");
const path = require('path');

// App.
const app = express();
const port = process.env.PORT || 8080;

async function main() {
    let dict_array = JSON.parse(await fs.readFile(path.resolve(__dirname, "res", "dict.json"), "utf8"));
    let dict_set = new Set(dict_array);
    
    // Request handler.
    app.get("/", (req, res) => {
        if (req.query.id === undefined) {
            res.sendFile(path.resolve(__dirname, "res", "index.html"));
            return;
        } 

        let wordId = req.query.id % dict_array.length;

        let word = dict_array[wordId];
        let wordTry = req.query.word;

        if (wordTry === undefined) {
            console.log(word);
            res.json({len: word.length, firstLetter: word[0]});
            return;
        }

        if (wordTry.length !== word.length) {
            res.json({error: "Longueur incorrecte"});
            return;
        } else if (!dict_set.has(wordTry)) {
            res.json({error: "Mot invalide"});
            return;
        }
        
        let okLetters = [];
        let misplaced = [];
        for (let i = 0; i < word.length; i++) {
            if (word[i] === wordTry[i]) {
                okLetters.push(i);
            } else if (word.includes(wordTry[i]))  {
                misplaced.push(i);
            }
        }

        if (okLetters.length === word.length) {
            res.json({win: "Gagné!"});
            return;
        }

        res.json({okLetters: okLetters, misplaced: misplaced});
    });
    
    // Listener.
    app.listen(port, () => {
        console.log(`Server is up at http://localhost:${port}`)
    });
}

main();