const glob = require('glob');
const path = require('path');


// import all modules, which match a certain pattern
function loadModules(modPath)  {
    if (modPath.startsWith('./')) {
        modPath = path.join(__dirname, modPath.replace('.', ''));
    }

    let modules = [];
    let counter = 1;
    glob.sync(modPath).forEach((f) => {
        // TODO do a sanity check if all necessary properties are present on the module
        var mod = require(f);
        mod["id"] = counter++;
        modules.push(mod);
    });

    return modules;
}


const tools = {
    obfuscators: loadModules('./obfuscators/*.js'),
    deobfuscators: loadModules('./deobfuscators/*.js')
};

module.exports.tools = tools;
