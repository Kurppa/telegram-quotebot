const Alias = require('../models/aliasModel')

const findAliases = async (name) => {
    try {
        const object = await Alias.findOne({ aliases: name }, { aliases: 1})
        if (object) {
            return object.aliases
        } else {
            return null
        }
    } catch (e) {
        throw "Error finding aliases"
    }
}

const addAlias = async (name1, name2) => {
    try {
        name1 = name1.toLowerCase()
        name2 = name2.toLowerCase()
        const alias = await Alias.findOne({ $in : [name1, name2]})
        if (alias) {
            [name1, name2].forEach(name => {
                if (!alias.aliases.includes(name)){
                    alias.aliases.push(name)
                }
            })
            await object.save()
        } else {
            const alias = new Alias({
                aliases: [name]
            })
            await alias.save()
        }
    } catch (e) {
        throw "Failed to add an alias"
    }
}

module.exports = { findAliases, addAlias }
