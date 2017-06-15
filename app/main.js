const glob = require('glob');
const path = require('path');
const fs = require('fs');

// import all modules, which match a certain pattern
function loadTools(toolsPath, type='obfuscator')  {
    if (toolsPath.startsWith('./')) {
        toolsPath = path.join(__dirname, toolsPath.replace('.', ''));
    }

    let modules = {};
    let counter = 1;
    glob.sync(toolsPath).forEach((f) => {
        // TODO do a sanity check if all necessary properties are present on the module
        let name = path.basename(f).replace(".js","");

        try {
            var mod = require(f);
            if (!mod.hidden) {
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
            content: encodeURIComponent(content)
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
        obfuscators: loadTools('./obfuscators/*.js', type='obfuscator'),
        deobfuscators: loadTools('./deobfuscators/*.js', type='deobfuscator')
    };

module.exports = {
    tools: tools,
    samples: loadSamples('./samples/*.js'),
    obfuscate,
    deobfuscate
};
