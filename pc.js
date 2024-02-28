const fs = require("fs-extra");
const postcss = require("postcss");
const path = require("path");
const pluginTst = require("./plugins/tst");
const prettier = require("prettier");
// Define the directories
const srcDir = path.join(__dirname, "src");
const distDir = path.join(__dirname, "dist");

console.log(prettier);

// First, clear the dist directory
fs.emptyDir(distDir)
  .then(() => {
    console.log("dist directory cleared!");
    // After clearing, proceed with reading and processing CSS files
    fs.readdir(srcDir, (err, files) => {
      if (err) {
        console.error("Failed to list contents of directory: " + err);
        return;
      }

      files
        .filter((file) => path.extname(file) === ".css") // Filter for CSS files
        .forEach((file) => {
          const filePath = path.join(srcDir, file);
          fs.readFile(filePath, "utf8")
            .then((css) => {
              return postcss([pluginTst])
                .process(css, { from: filePath, to: path.join(distDir, file) })
                .then((result) => {
                  // const formattedCss = prettier.format(result.css, {
                  //   parser: "css" /*, ...prettierConfig */,
                  // });
                  return prettier.format(result.css, { parser: "css" });
                })
                .then((res) => {
                  fs.outputFile(path.join(distDir, file), res) // Write the processed CSS
                    .then(() => console.log(`Processed ${file}`))
                    .catch((writeError) =>
                      console.error(`Failed to write ${file}: ${writeError}`)
                    );
                });
            })
            .catch((readError) => {
              console.error(`Failed to read ${file}: ${readError}`);
            });
        });
    });
  })
  .catch((err) => {
    console.error("Failed to clear dist directory: " + err);
  });
