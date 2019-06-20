const Alias = require('../models/aliasModel')
const sanitize = require('mongo-sanitize')

const findAliases = async (name, chatId) => {
    try {
        name = name.toLowerCase()
        const object = await Alias.findOne({ chatId: chatId, aliases: name }, { aliases: 1})
        if (object) {
            return object.aliases
        } else {
            return null
        }
    } catch (e) {
        throw "Error finding aliases"
    }
}

const addAlias = async (name1, name2, chatId) => {
    name1 = sanitize(name1.toLowerCase())
    name2 = sanitize(name2.toLowerCase())
    let alias = await Alias.find({ chatId: chatId, aliases: { $in : [name1, name2] }})
    if (alias.length === 1) {
        alias = alias[0] 
        const lista = [name1, name2]
        lista.forEach(name => {
            if (!alias.aliases.includes(name)){
                alias.aliases.push(name)
            }
        })
        await alias.save()
    } else if (alias.length === 0){
        const alias = new Alias({
            chatId: chatId,
            aliases: [name1, name2]
        })
        await alias.save() 
    } else {
        throw { code: 1, message: "Conflicting aliases" }
    }
}

module.exports = { findAliases, addAlias }
