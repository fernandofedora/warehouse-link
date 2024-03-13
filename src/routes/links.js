const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const parser = require('@json2csv/plainjs');
const multer = require('multer');
const upload = multer({
    dest: '.temp/csv/',
    fileFilter: function (req, file, cb) {
        file.mimetype === 'text/csv' ? cb(null, true) : cb(null, false);
    },
});

const csv = require('fast-csv');

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// Función para generar un hash MD5 único
function generateUniqueMD5() {
    const uniqueString = `${new Date().getTime()}${Math.random()}`;
    return crypto.createHash('md5').update(uniqueString).digest('hex');
}

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description,category } = req.body;
    
    // Genera un hash MD5 único
    const encryptedId = generateUniqueMD5();

    // Crea el nuevo enlace con el hash MD5 generado
    const newLink = {
        title,
        url,
        description,
        category,
        user_id: req.user.id,
        encrypted_id: encryptedId,
    };

    // Inserta el nuevo enlace en la base de datos
    await pool.query('INSERT INTO links SET ?', [newLink]);

    req.flash('success', 'Link Saved Successfully');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);

    const encryptedLinks = links.map(link => {
        if (link && link.id) {
            return {
                ...link,
                encryptedId: crypto.createHash('md5').update(link.id.toString()).digest('hex'),
            };
        } else {
            return link;
        }
    });
    const selectedView = req.query.view || 'cardView'; // Obtén la opción seleccionada de la URL o usa 'cardView' por defecto

    res.render('links/list', { links: encryptedLinks, selectedView });
});

router.get('/delete/:encrypted_id', isLoggedIn, async (req, res) => {
    const { encrypted_id } = req.params;
    //const decryptedId = crypto.createHash('md5').update(id).digest('hex');

    await pool.query('DELETE FROM links WHERE encrypted_id = ?', [encrypted_id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');

});

router.get('/edit/:encrypted_id', isLoggedIn, async (req, res) => {
    const { encrypted_id } = req.params;
    //let encryptedId = crypto.createHash('md5').update(id).digest("hex")
   //const encryptedId = crypto.MD5(id).toString();
   //const md5 = { id } = crypto.createHash('md5').update(data).digest("hex");
   const links = await pool.query('SELECT * FROM links WHERE encrypted_id = ?', [encrypted_id]);
   console.log('Encrypted ID:', encrypted_id);
   res.render('links/edit', { link: links[0]});
});
router.post('/edit/:encrypted_id', isLoggedIn, async (req, res) => {
    const { encrypted_id } = req.params;
    const { title, description, url } = req.body;

    // Utiliza el valor cifrado para buscar la fila correspondiente
    //const decryptedId = crypto.createHash('md5').update(id).digest('hex');
    const link = await pool.query('SELECT * FROM links WHERE encrypted_id = ?', [encrypted_id]);

    if (!link || link.length === 0) {
        req.flash('error', 'Link not found');
        return res.redirect('/links');
    }

    // Actualiza la fila con los nuevos datos
    const updatedLink = {
        title,
        description,
        url,
    };

    await pool.query('UPDATE links set ? WHERE encrypted_id = ?', [updatedLink, encrypted_id]);

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
    const importFile = req.file;
    if (!importFile) {
        req.flash('message', 'Please select a compatible CSV file to import your links');
        res.redirect('/profile');
        return;
    }

    var errCode = 0;
    const links = [];
    csv.parseFile(importFile.path, {headers: true})
    .on('data', (row) => {
        const title = row['title'];
        const url = row['url'];
        const description = row['description'];
        if (title == null || url == null || description == null) {
            errCode = -1;
        } else {
            // Genera un hash MD5 único
            const encryptedId = generateUniqueMD5();
            links.push({title, url, description, user_id: req.user.id, encrypted_id: encryptedId,});
        }
    })
    .on('error', _ => {
        req.flash('message', 'There was an error importing your links. Please try again later.');
        res.redirect('/profile');
    })
    .on('end', async (_) => {
        if (errCode != -1) {
            for (const link of links) {
                await pool.query('INSERT INTO links set ?', [link]);
            }
            req.flash('success', 'Your links were imported successfully');
            res.redirect('/links');
        } else {
            req.flash('message', 'There was an error importing your links. Please check the CSV format is compatible and try again.');
            res.redirect('/profile');
        }
    });
});

module.exports = router;
