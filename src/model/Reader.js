function isDirEmpty(fs, dirname) {
    return fs.promises.readdir(dirname).then(files => {
        console.log(files.length === 0);
    });
}

module.exports = isDirEmpty;