const fs = require("fs-extra");
const postcss = require("postcss");
const path = require("path");
const pluginTst = require("./plugins/tst");

// Define the directories
const srcDir = path.join(__dirname, "src");
const distDir = path.join(__dirname, "dist");
const stylelint = require('stylelint');

async function lintAndFixCss(css, cssFilePath) {
  // Run stylelint with the fix option to automatically fix issues
  const fixedCss = await stylelint.lint({
    code: css,
    configFile: path.resolve(__dirname, '.stylelintrc'), // or wherever your config file is
    fix: true, // This option will attempt to fix as many issues as it can
    formatter: "string",
    files: cssFilePath
  });

  return fixedCss.code; // Return the fixed CSS
}


// Recursive function to process CSS files in all subdirectories
async function processDirectory(directory) {
  const items = await fs.readdir(directory, { withFileTypes: true });
  for (const item of items) {
      const fullPath = path.join(directory, item.name);
      if (item.isDirectory()) {
          // If the item is a directory, process it recursively
          await processDirectory(fullPath);
      } else if (path.extname(item.name) === ".css") {
          // If the item is a CSS file, process it
          const options = {
            rootSelector: "#sport-simple-east",
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
