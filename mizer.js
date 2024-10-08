const mizer = exports;
const path = require('path');
const fs = require('fs');

//console.log(__dirname);


const _app_path = __dirname;

/*
fs.writeFileSync('mizer.js.txt', "MizerLibs: [" + _app_path +  "]" + path.resolve(_app_path, '..', 'app.asar.unpacked', 'libs') + "/", (err) => {
    if (err) throw err;
    console.log('Error writing mizer.js.txt');
});
*/

let java;
let jarDir;

if (path.extname(_app_path) === '.asar') {
  const java_node_modules_dir = path.resolve(_app_path, '..', 'app.asar.unpacked', 'node_modules', 'java')
  java = require(java_node_modules_dir)
  jarDir = path.resolve(_app_path, '..', 'app.asar.unpacked', 'libs') + "/"
} else {
  java = require('java')
  jarDir = _app_path + "/libs/"
}

console.log(jarDir);

["classes",
    "antlr-runtime-3.5.2.jar",
    "antlr4-runtime-4.7.1.jar",
    "commons-compress-1.20.jar",
    "commons-codec-1.10.jar",
    "commons-io-2.6.jar",
    "commons-lang3-3.11.jar",
    "dcm4che-core-2.0.29.jar",
    "dcm4che-iod-2.0.29.jar",
    "dcm4che-net-2.0.29.jar",
    "dicom-edit4-1.1.0.jar",
    "dicom-edit6-6.5.0.jar",
    "dicomtools-1.8.8.jar",
    "framework-1.8.8.jar",
    "guava-20.0.jar",
    "jai-imageio-core-1.3.0.jar",
    "jai-imageio-jpeg2000-1.3.0.jar",
    "java-uuid-generator-3.1.4.jar",
    "jcl-over-slf4j-1.7.30.jar",
    "log4j-1.2.17.jar",
    "mizer-1.2.4.jar",
    "pixelEditor-1.3.0.jar",
    "pixelmed-nrg-20200327.jar",
    "pixelmed-codec-20200328.jar",
    "pixelmed-imageio-20200328.jar",
    "reflections-0.9.11.jar",
    "slf4j-api-1.7.30.jar",
    "slf4j-log4j12-1.7.30.jar",
    "spring-core-4.3.30.RELEASE.jar",
    "transaction-1.8.8.jar"].forEach(jar => java.classpath.push(jarDir + jar))

const mizers = java.newInstanceSync("java.util.ArrayList");
mizers.addSync(java.newInstanceSync("org.nrg.dcm.edit.mizer.DE4Mizer"));
const scriptFactory = java.newInstanceSync("org.nrg.dicom.dicomedit.DE6ScriptFactory");
mizers.addSync(java.newInstanceSync("org.nrg.dicom.dicomedit.mizer.DE6Mizer", scriptFactory));

const mizerService = java.newInstanceSync("org.nrg.dicom.mizer.service.impl.BaseMizerService", mizers);

/**
 * Creates a Java Properties object from a hash of values. This object is what the Mizer service expects for
 * variables and values to be used during anonymization.
 *
 * Add more variables to the return from this function by calling:
 *
 * variables.setPropertySync('variableName', 'variableValue');
 *
 * @param variables A hash of variable names and values.
 *
 * @return A Java Properties object containing the submitted names and values.
 */
mizer.getVariables = (variables) => {
    const properties = java.newInstanceSync("java.util.Properties");
    // console.log('-----------------------------------');
    // console.log(variables);
    // console.log('-----------------------------------');
    
    if (variables) {
        Object.keys(variables).forEach(key => {
            properties.setPropertySync(key, variables[key]);
        });
    }

    return properties;
};

/**
 * Add variables, such as from {@link #getVariables()} above, to the return from this function by calling
 * context.addSync(variables).
 *
 * @param script The script for which a context should be created.
 *
 * @return A script context.
 */
mizer.getScriptContext = (script) => {
    const context = java.newInstanceSync("org.nrg.dicom.mizer.service.impl.MizerContextWithScript");

    context.setScriptSync(script);

    return context;
};

/**
 * Add variables, such as from {@link #getVariables()} above, to the return from this function by calling
 * context.addSync(variables).
 *
 * @param scripts The scripts for which contexts should be created.
 *
 * @return A list of script contexts.
 */
mizer.getScriptContexts = (scripts) => {
    const contexts = java.newInstanceSync("java.util.ArrayList");

    scripts.forEach(script => {
        const context = mizer.getScriptContext(script);
        contexts.addSync(context);
    });

    return contexts;
};

/**
 * Gets variables that are referenced in the contexts.
 */
mizer.getReferencedVariables = (contexts) => {
    //return mizerService.getReferencedVariablesSync(contexts);
    const variableMap = {};
    const variables = mizerService.getReferencedVariablesSync(contexts);
    
    let itr = variables.iteratorSync();
    
    while (itr.hasNextSync()) {
        variable = itr.nextSync();
        
        let initialValue = variable.getInitialValueSync();
        let variableValue = initialValue ? initialValue.asStringSync() : "";
        variableMap[variable.getNameSync()] = variableValue;
    }
    
    
    // for (let i = 0; i < variables.sizeSync(); i++) {
    //     console.log('***********************************', variables.sizeSync(), variables[i]);
    //     let variable = variables.getSync(i);
    //     let initialValue = variable.getInitialValueSync();
    //     let variableValue = initialValue ? initialValue.asStringSync() : "";
    //     variableMap.set(variable.getNameSync(), variableValue);
    // }

    
    console.log('************* REFERENCED VARIABLES ************************');
    console.log(variableMap);
    
    return variableMap;
};

/**
 * Anonymizes the DICOM object source using the supplied scripts. If variables have already been set on the script
 * contexts, the variables parameter can be omitted.
 *
 * @param source    The DICOM object to anonymize.
 * @param contexts  The script contexts to use for anonymization.
 * @param variables A Java Properties object to pass for variable substitution.
 */
mizer.anonymize_old = (source, contexts, variables) => {
    const dicom = java.newInstanceSync("java.io.File", source);

    contexts.forEach(context => context.addSync(variables));
    mizerService.anonymizeSync(dicom, contexts);
};

/**
 * Anonymizes the DICOM object source using the supplied scripts. If variables have already been set on the script
 * contexts, the variables parameter can be omitted.
 *
 * @param source    The DICOM object to anonymize.
 * @param contexts  The script contexts to use for anonymization.
 * @param variables A Java Properties object to pass for variable substitution.
 */
mizer.anonymize = (source, contexts, variables) => {
    const dicom = java.newInstanceSync("java.io.File", source);

    let itr = contexts.iteratorSync();
    while (itr.hasNextSync()) {
        context = itr.nextSync();
        context.addSync(variables);

        //console.log(context);
    }
    mizerService.anonymizeSync(dicom, contexts);
};

mizer.anonymize_single = (source, script, variables) => {
    const properties = java.newInstanceSync("java.util.Properties");

    if (variables) {
        Object.keys(variables).forEach(key => {
            properties.setPropertySync(key, variables[key]);
        });
    }

    const file = java.newInstanceSync("java.io.File", source);
    const context = java.newInstanceSync("org.nrg.dicom.mizer.service.impl.MizerContextWithScript", properties);
    context.setScriptSync(script);

    const list = java.callStaticMethodSync("java.util.Collections", "singletonList", context);

    mizerService.anonymizeSync(file, list);
};

mizer.get_scripts_anon_vars = (scripts) => {
    const contexts = mizer.getScriptContexts(scripts);
    return mizer.getReferencedVariables(contexts);
}

mizer.generateAlterPixelCode = (rectangles) => {
    let lines = rectangles.map(rect => {
      return `alterPixels["rectangle", "l=${Math.round(rect[0])}, t=${Math.round(rect[1])}, r=${Math.round(rect[2])}, b=${Math.round(rect[3])}", "solid", "v=100"]`;
    })
    
    if (lines.length) {
      lines.unshift(`version "6.1"`)
    }
    
    return lines.join("\n");
}

mizer.isMizerError = (error_message) => {
    return error_message && error_message.indexOf('org.nrg.dicom.mizer.exceptions.MizerException') >= 0
}
