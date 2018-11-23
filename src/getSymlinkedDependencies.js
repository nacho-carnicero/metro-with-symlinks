const fs = require('fs')
const path = require('path')

const resolveDependency = dependency => {
    if (fs.existsSync(dependency)) {
        return path.resolve('.', dependency)
    } else {
        if (
            path.resolve(path.join('..', dependency)) ===
            path.resolve(dependency)
        ) {
            return null
        } else {
            return resolveDependency(path.join('..', dependency))
        }
    }
}

const isSymlink = dependency => {
    const dependencyPath = resolveDependency(`node_modules/${dependency}`)
    if (dependencyPath === null)
        throw new Error(`Module ${module} is not installed.`)
    return fs.lstatSync(dependencyPath).isSymbolicLink()
}

module.exports = directory => {
    const pacakgeJson = require(`${directory}/package.json`)
    return [
        ...Object.keys(pacakgeJson.devDependencies || {}),
        ...Object.keys(pacakgeJson.dependencies || {}),
    ].filter(isSymlink)
}
