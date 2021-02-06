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
app.use(expressFileUpload());
// app.engine()

app.get("/", function (req, res) {
    res.render(path.join(__dirname, "client", "index.html"));
});

app.post("/uploadfile", function (req, res) {
    if (!req.files || Object.keys(req.files).length == 0) {
        res.setHeader("Content-Type", "application/json");
        return res.status(404).send(JSON.stringify({
            error: true,
            message: "No file was uploaded to the server!",
        }));
    }
    const uploadedFile = req.files.file;
    const uploadPath = path.join("./images/uploads/", uploadedFile.name);

    uploadedFile.mv(uploadPath, function (error) {
        if (error) {
            res.setHeader("Content-Type", "application/json");
            return res.status(404).send(JSON.stringify({
                error: true,
                message: error,
            }));
        }
    });

    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(JSON.stringify({
        error: false,
        message: "Successfully uploaded file to the server",
    }));
});

app.listen(PORT, function () {
    console.log("Listening on PORT:", PORT);
});