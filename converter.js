const Lame = require("node-lame").Lame;
const path = require("path");
const fs = require("fs");
const CFG = require("./config");

function oncomplete(from, to) {
    console.log("转换完成", from, to);
    fs.rmSync(from);
}

function onerror(err, where) {
    console.error("转换失败", where, err);
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let where = path.resolve(dir, file);
        let stat = fs.statSync(where);
        if (stat.isDirectory()) {
            traverse(where);
        } else if (stat.isFile()) {
            if (!file.endsWith(".mp3")) {
                let output = where.replace(path.extname(where), ".mp3");
                new Lame({ output, bitrate: 192 })
                    .setFile(where)
                    .encode()
                    .then(() => oncomplete(where, output))
                    .catch((err) => onerror(err, where));
            }
        }
    }
}

traverse(CFG.FROM);
