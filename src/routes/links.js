const express = require('express');
const crypto = require('crypto');
//const md5 = require('md5');
//const crypto = require('crypto-js');
const router = express.Router();
const parser = require('@json2csv/plainjs');
const multer  = require('multer');
const upload = multer({
    dest: '.temp/csv/',
    fileFilter: function (req, file, cb) {
        file.mimetype === 'text/csv' ? cb(null, true) : cb(null, false)
    }
});
const csv = require('fast-csv');

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { links });
});

router.get('/delete/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
     const { id } = req.params;
     let encryptedId = crypto.createHash('md5').update(id).digest("hex")
    //const encryptedId = crypto.MD5(id).toString();
    //const md5 = { id } = crypto.createHash('md5').update(data).digest("hex");
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log('Encrypted ID:', encryptedId);
    res.render('links/edit', { link: links[0], encryptedId, links});
});

router.post('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
});

router.get('/export', isLoggedIn, async (req, res) => {
    const myLinks = await pool.query('SELECT title, url, description FROM links WHERE user_id = ?', [req.user.id]);

    if (myLinks.length == 0) {
        req.flash('message', 'You have no links to export');
        res.redirect('/profile');
        return;
    }
    
    var jsonData = JSON.parse(JSON.stringify(myLinks));
    var csvParser = new parser.Parser();
    var csvData = csvParser.parse(jsonData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=my_links.csv');
    res.status(200).end(csvData);
});

router.post('/import', isLoggedIn, upload.single('mylinks'), async (req, res) => {
    var importFile = req.file;
    if(!importFile) {
        req.flash('message', 'Please select a compatible CSV file to import your links');
        res.redirect('/profile');
        return;
    }

    csv.parseFile(importFile.path, {headers: true})
    .on('data', async (row) => {
        const newLink = {
            title: row['title'],
            url: row['url'],
            description: row['description'],
            user_id: req.user.id
        };
        await pool.query('INSERT INTO links set ?', [newLink]);
    })
    .on('error', _ => {
        req.flash('message', 'There was an error importing your links. Please try again later.');
        res.redirect('/profile');
        return;
    })
    .on('end', _ => {
        req.flash('success', 'Your links were imported successfully');
        res.redirect('/links');
    });
});

module.exports = router;