const fs = require('fs')
const csvjson = require('csvjson')

const [,, option, nameArg, sexArg, ageArg, heightArg, weightArg] = process.argv

class Bio {
  constructor(name, sex, age, height, weight) {
    this.name = name.charAt(0).toUpperCase() + name.substr(1).toLowerCase()
    this.sex = sex.toUpperCase()
    this.age = Number(age)
    this.height = Number(height)
    this.weight = Number(weight)
  }

  nameValid() {
    return typeof this.name === 'string'
  }

  sexValid() {
    return typeof this.sex === 'string'
    && 'FM'.includes(this.sex.toUpperCase())
  }

  ageValid() {
    return Number(this.age) && this.age >= 18
  }

  heightValid() {
    return Number(this.age)
  }

  weightValid() {
    return Number(this.age)
  }

  propertiesValid() {
    let invalid = []

    if (!this.nameValid()) {
      invalid = [...invalid, 'name']
    }

    if (!this.sexValid()) {
      invalid = [...invalid, 'sex']
    }

    if (!this.ageValid()) {
      invalid = [...invalid, 'age']
    }

    if (!this.heightValid()) {
      invalid = [...invalid, 'height']
    }

    if (!this.weightValid()) {
      invalid = [...invalid, 'weight']
    }

    return invalid.length ? invalid.join(', ') : 'VALID'
  }
}

const nameExists = (dataMap, name) => {
  const keys = [...dataMap.keys()]
  if (keys.includes(name.toUpperCase())) {
    return true
  }
  return false
}

const createBio = (bioMap, newBio) => {
  if (nameExists(bioMap, newBio.name) === true) throw new Error('Name exists')
  const newBioMap = bioMap.set(newBio.name, newBio)
  return newBioMap
}

const readBio = (bioMap, name) => {
  if (nameExists(bioMap, name) === false) throw new Error('Name does not exist')
  return bioMap.get(name.toUpperCase()) || null
}

const updateBio = (bioMap, updatedBio) => {
  if (nameExists(bioMap, updatedBio.name) === false) throw new Error('Name does not exist')
  return bioMap.set(updatedBio.name.toUpperCase(), updatedBio)
}

const deleteBio = (bioMap, name) => {
  if (nameExists(bioMap, name) === false) throw new Error('Name does not exist')
  return bioMap.delete(name.toUpperCase())
}

const readCSVFile = (filePath) => {
  const data = fs.readFileSync(filePath, { encoding: 'utf8' })
  const options = {
    delimiter: ',',
    quote: '"',
  }
  return csvjson.toObject(data, options)
}

const writeCSVFile = (filePath, bioDetails) => {
  try {
    fs.writeFileSync(filePath, csvjson.toCSV(bioDetails, { headers: 'key', delimiter: ',\t\t\t\t\t\t\t' }))
  } catch (err) {
    console.error('Failure')
  }
}

const createBioObject = (name, sex, age, height, weight) => {
  const newBioObject = new Bio(name, sex, age, height, weight)

  if (newBioObject.propertiesValid() !== 'VALID') {
    throw new Error('Invalid inputted values')
  }
  return newBioObject
}

const validArgument = (opt, nameArgu, sexArgu, ageArgu, heightArgu, weightArgu) => {
  if ((opt === '-c' || opt === '-u') && (nameArgu === undefined || sexArgu === undefined
  || ageArgu === undefined || heightArgu === undefined || weightArgu === undefined)) {
    throw new Error('Incomplete arguments.')
  }
  if ((option === '-r' || option === '-d') && (sexArgu !== undefined
    || ageArgu !== undefined || heightArgu !== undefined || weightArgu !== undefined)) {
    throw new Error('Too much arguments.')
  }
  return true
}

try {
  const data = readCSVFile('biostats.csv')
  const dataMap = new Map()
  data.forEach((object) => {
    dataMap.set(object.name.toUpperCase(), object)
  })
  switch (option) {
    case '-c': {
      validArgument('-c', nameArg, sexArg, ageArg, heightArg, weightArg)
      const bioDetails = createBio(dataMap, createBioObject(
        nameArg,
        sexArg,
        ageArg,
        heightArg,
        weightArg,
      ))
      const values = Array.from(bioDetails.values())
      writeCSVFile('biostats.csv', values)
      console.log('Created File Successfully')
      break
    }
    case '-r': {
      validArgument('-r', nameArg, sexArg, ageArg, heightArg, weightArg)
      if (readBio(dataMap, nameArg) !== null) {
        console.log(`Name: ${readBio(dataMap, nameArg).name} 
Age: ${readBio(dataMap, nameArg).age} years old 
Sex: ${readBio(dataMap, nameArg).sex === 'f'.toLowerCase() ? 'female' : 'male'}
Height is ${readBio(dataMap, nameArg).height} in inches and ${readBio(dataMap, nameArg).height * 2.54} in centimeters.
Weight is ${readBio(dataMap, nameArg).weight} in pounds and ${readBio(dataMap, nameArg).weight * 0.45359237} in kilograms.`)
      }
      break
    }
    case '-u': {
      validArgument('-u', nameArg, sexArg, ageArg, heightArg, weightArg)
      const updatedDetails = updateBio(dataMap, createBioObject(
        nameArg,
        sexArg,
        ageArg,
        heightArg,
        weightArg,
      ))
      writeCSVFile('biostats.csv', Array.from(updatedDetails.values()))
      console.log('Updated File Successfully')
      break
    }
    case '-d': {
      validArgument('-d', nameArg, sexArg, ageArg, heightArg, weightArg)
      writeCSVFile('biostats.csv', Array.from(deleteBio(dataMap, nameArg).values()))
      console.log('Deleted File Successfully')
      break
    }
    default: {
      throw new Error('Invalid flag')
    }
  }
} catch (error) {
  console.log(error.toString())
}
