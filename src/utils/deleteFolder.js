const deleteFolder = async (path) => {
 try {
     // delete the folder if exists
     await require("node:fs/promises").rm(path, {
       recursive: true,
     });
 } catch (error) {
    // nothing
 }
};

module.exports = deleteFolder;
