import { existsSync, readdirSync, readFileSync } from 'fs';
import { expect } from 'chai';

const getJavaScriptFiles = (directory = 'assets/scripts') => {
  // Set an empty array
  let jsFiles = [];
  // Get files
  const entries = readdirSync(directory, { withFileTypes: true });

  // Loop through each entry
  for (const entry of entries) {
    // Get the entry name
    const { name } = entry;
    // Create the full entry path
    const fullPath = [directory, name].join('/');
    // Check if the entry is a directory or a file
    if (entry.isDirectory()) {
      // If the entry is a directory, recursively search it
      jsFiles = jsFiles.concat(getJavaScriptFiles(fullPath));
    } else if (entry.isFile() && name !== 'scripts.js') {
      // If the entry is a .js file that's not named `scripts.js`, add it to the list
      jsFiles.push(fullPath);
    }
  }

  // Return the array of JavaScript files
  return jsFiles;
};

const getTestFile = (filePath) => {
  return filePath.replace('assets/', 'test/').replace('.js', '.spec.js');
};

const getExportedFunctions = (filePath) => {
  // Read the file content
  const fileContent = readFileSync(filePath, 'utf-8');
  // Match the export block
  const exportBlock = fileContent.match(/export\s*\{\s*(?<inside>[\s\S]*?)\s*\}\s*;/u);

  // If there is an export block, extract the function names
  if (exportBlock) {
    // Get the inside of the export block
    const { inside } = exportBlock.groups ?? {};
    // Identifiers (handles whitespace/newlines and trailing commas)
    const names = inside.match(/\b[A-Za-z_$][\w$]*\b/gu) ?? [];
    // Return the array of exports
    return names;
  }

  // Return an empty array
  return [];
};

describe('spec files', function () {
  it('should have a spec file for every JavaScript file', function () {
    // Loop through each file
    getJavaScriptFiles().forEach((filePath) => {
      // Update the file path to point to the corresponding test file
      const testFile = getTestFile(filePath);
      // Check that the test file exists
      expect(existsSync(testFile), `\`${filePath}\` should have a spec file located at: \`${testFile}\``).to.be.true;
    });
  });

  it('exported functions have describe blocks in their designated spec files', function () {
    // Loop through each file
    getJavaScriptFiles().forEach((filePath) => {
      // Get the exported functions from the file
      const exportedFunctions = getExportedFunctions(filePath);
      // Get the test file
      const testFile = getTestFile(filePath);
      // Get the test file content
      const testFileContent = existsSync(testFile) ? readFileSync(testFile, 'utf-8') : '';
      // Loop through the exported functions
      exportedFunctions.forEach((funcName) => {
        expect(testFileContent.includes(`describe('${funcName}`), `\`${funcName}\` does not have a describe block in: \`${testFile}\``).to.be.true;
      });
    });
  });
});
