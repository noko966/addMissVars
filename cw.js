const fs = require("fs-extra");
const postcss = require("postcss");
const path = require("path");
// const pluginTst = require("./plugins/cw");
// const pluginTst = require("./plugins/cwOverlay");
const pluginTst = require("./plugins/isLight");


const partners = [
  1200,
  1245,
  1246,
  10154,
  1124,
  116,
  1249,
  1250,
  1252,
  1254,
  1255,
  1099,
  1162,
  1253,
  1021,
  105,
  1257,
  1110,
  1043,
  1191,
  10184,
  1001,
  1259,
  1040,
  1018,
  1136,
  1066,
  1053,
  1260,
  1107,
  1107,
  1247,
  1258,
  1263,
  1206,
  1230,
  1240,
  1264,
  1189,
  1217,
  1225,
  1222,
  1226,
  1109,
  1241,
  1218,
  1223,
  1231,
  1085,
  1208,
  1220,
  1221,
  1238 
]

// Define the directories
const srcDir = path.join(__dirname, "src");
const distDir = path.join(__dirname, "dist");

// Recursive function to process CSS files in all subdirectories
async function processDirectory(directory) {
  const items = await fs.readdir(directory, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(directory, item.name);
    if (item.isDirectory()) {
      // If the item is a directory, process it recursively
      await processDirectory(fullPath);
    } else if (path.extname(item.name) === ".css") {

      const fileNameWithoutExt = path.basename(item.name, ".css");
      const filePartnerId = parseInt(fileNameWithoutExt, 10);

      // 2) Skip if not in partners
      if (!partners.includes(filePartnerId)) {
        continue;
      }
      
      // If the item is a CSS file, process it
      const options = {
        rootSelector: ":root",
        partnerId: fullPath
      }
      const css = await fs.readFile(fullPath, "utf8");
      const result = await postcss([pluginTst(options)]).process(css, { from: fullPath, to: path.join(distDir, path.relative(srcDir, fullPath)) });
      // const fixedCss = await lintAndFixCss(result.css);
      await fs.outputFile(path.join(distDir, path.relative(srcDir, fullPath)), result.css);
      console.log(`Processed ${fullPath}`);
    }
  }
}

// First, clear the dist directory, then process the src directory
fs.emptyDir(distDir)
  .then(() => {
    console.log("dist directory cleared!");
    return processDirectory(srcDir);
  })
  .catch(err => {
    console.error("Error during processing: " + err);
  });
