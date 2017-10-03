const fs = require('fs')

 /**
   * Returns the function associated with the key name in modules
   * @param {string} modName - The name of the module to require
   */
global.myRequire = (modName) => {
  let allModules = fs.readFileSync('modules.json', 'utf8') // grabs the modules data
  let parsedModules = parseModule(allModules) // parse the JSON module into an object
  
  if(!parsedModules[modName]) {
    throw new Error(`${modName} module does not exist`)
    return undefined
  }
  return parsedModules[modName]
}
/**
   * Stores the modules object into a JSON file in directory.
   * @param {string} modName - The name of the module to define
   * @param {function} fn - The function assiociated with the module
   */
global.myDefine = (modName, fn) => {
  let modObj = {}
  modObj[modName] = fn

  let JSONmodule = stringifyModule(modObj)

  fs.readFile('modules.json', 'utf8', (err, allModules) => {
    if(err) {
      fs.writeFileSync('modules.json', JSONmodule, 'utf8')
      return
    }
    
    if(allModules === '') {
      fs.writeFileSync('modules.json', JSONmodule, 'utf8')
    } else {
      let modulesObj = parseModule(allModules)
      if(modulesObj[modName]) {
        throw new Error(`${modName} module already exists`)
      } else {
        modulesObj[modName] = fn
        let updatedModules = stringifyModule(modulesObj)
        fs.writeFileSync('modules.json', updatedModules, 'utf8')
      }
    }
  })
}
/**
   * Helper function to practice DRY and stringify object
   * @param {object} modObj - The object to be converted to JSON object
   * @return {object} JSON Object
   */
const stringifyModule = (modObj) => {
  return JSON.stringify(modObj, (key, value) => {
    if (typeof value === 'function') {
      return value.toString();
    } else {
      return value;
    }
  })
}
/**
   * Stores the modules object into a JSON file in directory.
   * @param {object} JSONMod - The JSON object to be converted to object
   * @return {object} Object
   */
const parseModule = (JSONMod) => {
  return JSON.parse(JSONMod, (key, value) => {
          return eval(value)
        })
}
