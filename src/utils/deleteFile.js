const deleteFile = async (path) => {
  try {
    await require("node:fs/promises").unlink(path);
  } catch (error) {
    // nothing
  }
};

module.exports = deleteFile;
