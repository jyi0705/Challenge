const fs = require('fs')

global.myRequire = (modName) => {
  let allModules = fs.readFileSync('modules.json', 'utf8')
  let parsedModules = parseModule(allModules)
  
  if(!parsedModules[modName]) {
    throw new Error(`${modName} module does not exist`)
    return undefined
  }
  return parsedModules[modName]
}

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

const stringifyModule = (modObj) => {
  return JSON.stringify(modObj, (key, value) => {
    if (typeof value === 'function') {
      return value.toString();
    } else {
      return value;
    }
  })
}

const parseModule = (JSONMod) => {
  return JSON.parse(JSONMod, (key, value) => {
          return eval(value)
        })
}
