import fs from "fs";
import path from "path";
import url from "url";
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import busboy from "connect-busboy";
import chalk from "chalk";
import colors from "colors";
import expressFileUpload from "express-fileupload";
import firebaseAdmin from "firebase-admin";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url)),
PORT = process.env.PORT || 8080;

const log = console.log;
const app = express();

app.use(express.static(path.join(__dirname, "client")));
app.set("engine", "html");
app.set("views", path.join(__dirname, "client"));
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json());
app.use(busboy());
app.use(expressFileUpload({
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
}));
// app.engine()

app.get("/", function (req, res) {
    res.render(path.join(__dirname, "client", "index.html"));
});

firebaseAdmin.initializeApp({
    credential:firebaseAdmin.credential.cert(JSON.parse(fs.readFileSync(path.join("./tokens.json")))),
    storageBucket: "gs://meter-detection-startup.appspot.com",
});

const bucket = firebaseAdmin.storage().bucket();

function uploadFileToCloud(path) {
    if (!fs.existsSync(path)) return;

    bucket.upload(path).then(function (data) {
        console.log("Succesfully uploaded to the cloud! You can find me here at {0}".replace("{0}", data[0].id));

        fs.unlinkSync(path);
    }).catch(function (error) {
        return console.error(error);
    });
}

app.post("/uploadfile", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        if (!req.files || Object.keys(req.files).length == 0) {
            throw [true, "No file was uploaded to the server!"];
        }
        else {
            const uploadedFile = req.files.file;
            const uploadPath = path.join("./images", uploadedFile.name);

            uploadedFile.mv(uploadPath, function (error) {
                if (error) throw [true, error];

                uploadFileToCloud(uploadPath);

                return res.status(200).send(JSON.stringify({
                    error: false,
                    message: "Successfully uploaded file to the server",
                }));
            });
        }
    }
    catch (error) {
        const [isError, errorMessage] = error;
        console.log(error);
        return res.status(404).send(JSON.stringify({
            error: isError,
            message: errorMessage,
        }));
    }
});

app.listen(PORT, function () {
    console.log("Listening on PORT:", PORT);
});
