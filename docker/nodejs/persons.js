const stringSimilarity = require('string-similarity');

const persons = require('./data').persons;;

const nameToIds = {};
persons.forEach(mapNameToIds(person => person.firstName, nameToIds));
persons.forEach(mapNameToIds(person => person.lastName, nameToIds));

function mapNameToIds(getName, names) {
    return (person, index) => {
        const name = getName.call(null, person);
        names[name] = names[name] || [];
        names[name].push(index);
    };
}

findPersonByName = (name) => {
    const result = stringSimilarity.findBestMatch(name, Object.keys(nameToIds));
    
    return result.ratings
        .filter(rating => rating.rating >= 0.25)
        .flatMap(rating => nameToIds[rating.target].map(id => ({ id: id, rating: rating["rating"] })))
        .map(rating => ({ target: persons[rating.id], rating: rating.rating }));
}

module.exports.findPersonByName = findPersonByName;
