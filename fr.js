const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

// Source and destination directories
const srcDir = path.join(__dirname, 'src', 'css');
const distDir = path.join(__dirname, 'dist', 'css');

// Counters and lists
let totalFiles = 0;
let filesWithSelector = 0;
let filesWithSelectorAndColor = 0;
let filesWithoutSelector = 0;

const filesWithSelectorList = [];
const filesWithSelectorAndColorList = [];
const filesWithoutSelectorList = [];

// Function to process CSS files
async function processCssFile(filePath, outputFilePath) {
    const css = await fs.readFile(filePath, 'utf-8');
    const root = postcss.parse(css);

    let hasPlusClass = false;
    let hasColor = false;

    root.walkRules(rule => {
        let colorValue = null;
        let modifiedSelectors = false;

        rule.selectors = rule.selectors.map(selector => {
            return selectorParser(selectors => {
                selectors.walkClasses(node => {
                    if (node.value === 'plus18Icon') {
                        hasPlusClass = true;
                        node.value = 'cw_mob_footer_18_wrapper';
                        modifiedSelectors = true;
                    }
                });
            }).processSync(selector);
        });

        if (modifiedSelectors) {
            rule.walkDecls(decl => {
                if (decl.prop === 'color') {
                    colorValue = decl.value;
                    hasColor = true;
                }
            });

            if (colorValue) {
                rule.removeAll(); // Remove all declarations
                rule.append({ prop: 'color', value: colorValue }); // Add only the color declaration
            } else {
                rule.removeAll(); // Remove the entire rule if no color property exists
                rule.append({ prop: 'color', value: "currentColor" }); // Add only the color declaration
            }
        }
    });

    if (hasPlusClass) {
        filesWithSelector++;
        filesWithSelectorList.push(filePath);
        if (hasColor) {
            filesWithSelectorAndColor++;
            filesWithSelectorAndColorList.push(filePath);
        }
    } else {
        filesWithoutSelector++;
        filesWithoutSelectorList.push(filePath);
    }

    await fs.outputFile(outputFilePath, root.toString());
}

// Main function to process all CSS files
async function main() {
    const files = await fs.readdir(srcDir);
    totalFiles = files.length;

    for (const file of files) {
        console.log(file);

        const filePath = path.join(srcDir, file);
        const outputFilePath = path.join(distDir, file);

        await processCssFile(filePath, outputFilePath);
    }

    // Print or save the results
    console.log(`Total files processed: ${totalFiles}`);
    console.log(`Files with selector: ${filesWithSelector}`);
    console.log(`Files with selector and color: ${filesWithSelectorAndColor}`);
    console.log(`Files without selector: ${filesWithoutSelector}`);

    console.log('Files with selector:', filesWithSelectorList);
    console.log('Files with selector and color:', filesWithSelectorAndColorList);
    console.log('Files without selector:', filesWithoutSelectorList);

    // Optionally, save the results to a file
    await fs.outputJson(path.join(distDir, 'results.json'), {
        totalFiles,
        filesWithSelector,
        filesWithSelectorAndColor,
        filesWithoutSelector,
        filesWithSelectorList,
        filesWithSelectorAndColorList,
        filesWithoutSelectorList
    });
}

main().catch(err => {
    console.error(err);
});
