const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

const router = express.Router();

app.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/', router);

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});