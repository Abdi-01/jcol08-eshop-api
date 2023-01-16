const multer = require('multer');
const fs = require('fs');

module.exports = {
    uploader: (directory, filePrefix) => {
        // Define default directory location
        let defaultDir = './src/public';

        // Multer configuration
        const storageUploader = multer.diskStorage({
            destination: (req, file, cb) => {
                // Menentukan lokasi penyimpanan
                const pathDir = directory ? defaultDir + directory : defaultDir;

                // Melakukan pemeriksaan pathDir
                if (fs.existsSync(pathDir)) {
                    // Jika directory ada, maka multer akan menjalankan parameter cb untuk menyimpan data
                    console.log(`Directory ${pathDir} exist ✅`);
                    cb(null, pathDir);
                } else {
                    // Jika directory tidak ada
                    fs.mkdir(pathDir, { recursive: true }, (err) => {
                        if (err) {
                            console.log(`Error make directory`, err);
                        }

                        cb(err, pathDir);
                    })
                }
            },
            filename: (req, file, cb) => {
                // Membaca extention
                let ext = file.originalname.split('.');
                console.log(ext);

                let newName = filePrefix + Date.now() + '.' + ext[ext.length - 1];
                console.log('New filename', newName);
                cb(null, newName);
            }
        });

        return multer({
            storage: storageUploader, fileFilter: (req, file, cb) => {
                const extFilter = /\.(jpg|png|webp|doc|pdf)/;
                let check = file.originalname.toLowerCase().match(extFilter);
                if (check) {
                    cb(null, true);
                } else {
                    cb(new Error('Your file ext denied ❌', false));
                }
            }
        })
    }
}