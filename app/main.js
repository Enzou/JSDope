const glob = require('glob');    // load package for pattern matching paths
const path = require('path');    // path utility module
const fs = require('fs');        // module for interacting with the filesystem

/**
 * Import all modules, which match a certain path-pattern
 * @param {string} toolsPath - the path string with the pattern
 * @param {string} type - the type of tool which is at the given path
 * @returns {Object} - an dictionary with all the loaded modules. The order in which it is loaded is the key and id in that dictionary
 */
function loadTools(toolsPath, type='obfuscator')  {
    if (toolsPath.startsWith('./')) {
        toolsPath = path.join(__dirname, toolsPath.replace('.', ''));
    }

    let modules = {};
    let counter = 1;

    // iterate over every module matching the pattern and add it to the modules dictionary
    glob.sync(toolsPath).forEach((f) => {
        // TODO do a sanity check if all necessary properties are present on the module
        let name = path.basename(f).replace(".js","");

        try {
            var mod = require(f);
            if (!mod.hidden) {  // only add module if this flag is not set by the module
                mod.id = counter;
                mod.type = type;
                modules[counter++] = mod;
            } else {
                console.warn("Skipping module \'" + name + "\'");
            }
        } catch (exc) {
            console.error("Couldn't load module \'" + name + "\': " + exc);
        }
    });

    return modules;
}

/**
 * Import all samples from the given directory
 * @param {string} samplesPath - the path string with the pattern for the samples
 * @returns {Object} - an dictionary with all the loaded samples. The order in which it is loaded is the key and id in that dictionary
 */
function loadSamples(samplesPath) {
    if (samplesPath.startsWith('./')) {
        samplesPath = path.join(__dirname, samplesPath.replace('.', ''));
    }

    let samples = {};
    let counter = 1;
    // iterate over every file matching the pattern and add it to the modules dictionary
    glob.sync(samplesPath).forEach((f) => {
        let content = fs.readFileSync(f, 'utf-8');
        var sample = {
            id: counter,
            name: path.basename(f).replace(".js", ""),
            content: encodeURIComponent(content) // make sure the content is properly encoded so it can be properly transmitted to the front-end
        };
        samples[counter++] = sample;
    });

    return samples;
}

/**
 * Obfuscate the given sample with the proper tool indicated by the given id and return a promise of the result.
 * @param {number} id - the id of the tool to use
 * @param {string} code - the sample code, which should be processed
 * @param {Object} options - the object with the options for the processing
 * @returns {Promise} promise of the result. The Object contains code, time and compressionRate
 */
function obfuscate(id, code, options) {
    return tools.obfuscators[id].process(code, options);
}

/**
 * Deobfuscate the given sample with the proper tool indicated by the given id and return a promise of the result.
 * @param {number} id - the id of the tool to use
 * @param {string} code - the sample code, which should be processed
 * @param {Object} options - the object with the options for the processing
 * @returns {Promise} promise of the result. The Object contains code, time and compressionRate
 */
function deobfuscate(id, code, options) {
    return tools.deobfuscators[id].process(code, options);
}

const tools = {
        obfuscators: loadTools('./obfuscators/*.js', type='obfuscator'),
        deobfuscators: loadTools('./deobfuscators/*.js', type='deobfuscator')
    };

module.exports = {
    tools: tools,
    samples: loadSamples('./samples/*.js'),
    obfuscate,
    deobfuscate
};
