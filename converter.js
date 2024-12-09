const Lame = require("node-lame").Lame;
const path = require("path");
const fs = require("fs");
const CFG = require("./config");
const SAVE = path.join(__dirname, CFG.OUTPUT);

function save() {
    if (!fs.existsSync(SAVE)) {
        fs.mkdirSync(SAVE);
    }
}

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
            if (!file.endsWith(CFG.TARGET)) {
                const output = path.join(SAVE, path.basename(file, path.extname(file)) + CFG.TARGET);
                if (!fs.existsSync(output)) {
                }
                new Lame({ output, bitrate: CFG.BITRATE })
                    .setFile(where)
                    .encode()
                    .then(() => oncomplete(where, output))
                    .catch((err) => onerror(err, where));
            }
        }
    }
}

save();
traverse(CFG.FROM);
