import { writeFile } from 'fs';
import lists from '../src/lists.js'

let db = {
    "Comments": [],
    "Errors": [],
    "Log": [],
    "Users": [],
    "Questions": [],
    "ReleaseNotes": [],
        "Roles": [
        {
            "Id": 1,
            "Title": "Administrator"
        },
        {
            "Id": 2,
            "Title": "Developer"
        },
        {
            "Id": 3,
            "Title": "User"
        }
    ],
    "Settings": [
        {
            "Id": 1,
            "Key": "QuestionTypes",
            // "Value": "[{\"title\":\"General\"]"
            "Value": JSON.stringify([
                {
                    "title": "General",
                    "path": "General"
                }
            ])
        }
    ]
}

lists.forEach(item => {
    const { list } = item;

    db[list] = [];
});

writeFile('./json-server/db.json', JSON.stringify(db), err => {
    if (err) {
        console.error(err)
        return
    }
})

console.log('db.json reset');