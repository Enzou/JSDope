const glob = require('glob');
const path = require('path');
const fs = require('fs');

// import all modules, which match a certain pattern
function loadTools(toolsPath)  {
    if (toolsPath.startsWith('./')) {
        toolsPath = path.join(__dirname, toolsPath.replace('.', ''));
    }

    let modules = {};
    let counter = 1;
    glob.sync(toolsPath).forEach((f) => {
        // TODO do a sanity check if all necessary properties are present on the module
        var mod = require(f);
        mod["id"] = counter;
        modules[counter++] = mod;
    });

    return modules;
}

function loadSamples(samplesPath) {
    if (samplesPath.startsWith('./')) {
        samplesPath = path.join(__dirname, samplesPath.replace('.', ''));
    }

    let samples = {};
    let counter = 1;
    glob.sync(samplesPath).forEach((f) => {
        let content = fs.readFileSync(f, 'utf-8');
        var sample = {
            id: counter,
            name: path.basename(f).replace(".js", ""),
            content: content
        };
        samples[counter++] = sample;
    });

    return samples;
}

function obfuscate(id, code, options) {
    return tools.obfuscators[id].process(code, options);
}

function deobfuscate(id, code, options) {
    return tools.deobfuscators[id].process(code, options);
}


const tools = {
        obfuscators: loadTools('./obfuscators/*.js'),
        deobfuscators: loadTools('./deobfuscators/*.js')
    };

module.exports = {
    tools: tools,
    samples: loadSamples('./samples/*.js'),
    obfuscate,
    deobfuscate
};
