const glob = require('glob');
const path = require('path');


// import all modules, which match a certain pattern
function loadModules(modPath)  {
    if (modPath.startsWith('./')) {
        modPath = path.join(__dirname, modPath.replace('.', ''));
    }

    let modules = [];
    glob.sync(modPath).forEach((f) => {
        // TODO do a sanity check if all necessary properties are present on the module
        modules.push(require(f));
    });

    return modules;
}


const tools = {
    obfuscators: loadModules('./obfuscators/*.js'),
    deobfuscators: loadModules('./deobfuscators/*.js')
};

// const data = {
//     obfuscators: ['Dan\'s JS Obfuscator', 'YUI Compressor', 'JavaScript Obfuscator', 'JS Obfuscator for Node.js', 'JavaScript2Image', 'JJEncode'],
//     deobfuscators: ['JSBeautifier', 'Kahu Security\s Revelo', 'JavaScript Debofuscator Firefox Add-On', 'Honeybadger', 'JSDetox']
// };

const names = {
    obfuscators: tools.obfuscators.map((o) => { return o.name; }),
    deobfuscators: tools.deobfuscators.map((o) => { return o.name; })
};

module.exports.data = names;

module.exports.process = tools.obfuscators[0].process;
