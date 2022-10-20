const fs = require('fs')
const csvjson = require('csvjson')

const [,, option, nameArg, sexArg, ageArg, heightArg, weightArg] = process.argv
let viewFile = []

class Bio {
  constructor(name, sex, age, height, weight) {
    this.name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    this.sex = sex.toUpperCase()
    this.age = Number(age)
    this.height = Number(height)
    this.weight = Number(weight)
  }
}

const createBioFile = (bioArray, newBio) => {
  const newFile = [...bioArray, newBio]
  return newFile
}

const readBioFile = (bioArray, name) => {
  for (let i = 0; i < bioArray.length; i += 1) {
    if (bioArray[i].name.toUpperCase() === name.toUpperCase()) {
      viewFile = bioArray[i]
    }
  }
  return viewFile
}

const updateBioFile = (bioArray, updateBio) => {
  let foundAt = 0
  for (let i = 0; i < bioArray.length; i += 1) {
    if (bioArray[i].name.toUpperCase() === updateBio.name) {
      foundAt = i
    }
  }
  bioArray.splice(foundAt, 1, updateBio)
  return bioArray
}

const deleteBioFile = (bioArray, name) => {
  let foundAt = 0
  for (let i = 0; i < bioArray.length; i += 1) {
    if (bioArray[i].name.toUpperCase() === name.toUpperCase()) {
      foundAt = i
      break
    }
  }
  bioArray.splice(foundAt, 1)
  return bioArray
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
    fs.writeFileSync(filePath, csvjson.toCSV(bioDetails, { headers: 'key' }))
  } catch (err) {
    console.error('Failure')
  }
}

const data = readCSVFile('biostats.csv')

if (option === undefined) {
  console.log('Missing argument')
  process.exit(1)
}
if (option !== '-c' && option !== '-r' && option !== '-u' && option !== '-d') {
  console.log('Incorrect flag')
  process.exit(1)
}
if (option === '-c') {
  if (nameArg === undefined || sexArg === undefined || ageArg === undefined
    || heightArg === undefined || weightArg === undefined || process.argv.length > 8) {
    console.log('Cannot perform option with inputted arguments.')
    process.exit(1)
  }
  let found = 0
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].name.toUpperCase() === nameArg.toUpperCase()) {
      found = 1
    }
  }
  if (found === 1) {
    console.log('Name already exist')
    process.exit(1)
  }
  if (sexArg !== 'f' && sexArg !== 'F' && sexArg !== 'm' && sexArg !== 'M') {
    console.log('Incorrect sex')
    process.exit(1)
  }
  if (!(ageArg >= 18)) {
    console.log('Age not a number or underaged')
    process.exit(1)
  }
  if (!(Number(heightArg))) {
    console.log('Height not a number')
    process.exit(1)
  }
  if (!(Number(weightArg))) {
    console.log('Weight not a number')
    process.exit(1)
  }
  const bioDetails = createBioFile(data, new Bio(nameArg, sexArg, ageArg, heightArg, weightArg))
  if (bioDetails !== null) {
    writeCSVFile('biostats.csv', bioDetails)
    console.log('Created File Successfully')
  }
}
if (option === '-r') {
  if (nameArg === undefined || process.argv.length > 4) {
    console.log('Cannot perform option with inputted arguments.')
    process.exit(1)
  }
  let found = 0
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].name.toUpperCase() === nameArg.toUpperCase()) {
      found = 1
    }
  }
  if (found !== 1) {
    console.log('Name does not exist')
    process.exit(1)
  }
  if (readBioFile(data, nameArg) !== null) {
    console.log(`${viewFile.name} is a ${viewFile.age} year old ${viewFile.sex === 'f'.toLowerCase() ? 'female' : 'male'}.
Height is ${viewFile.height} in inches and ${viewFile.height * 2.54} in centimeters.
Weight is ${viewFile.weight} in pounds and ${viewFile.weight * 0.45359237} in kilograms.
    `)
  }
}
if (option === '-u') {
  if (nameArg === undefined || sexArg === undefined || ageArg === undefined
    || heightArg === undefined || weightArg === undefined || process.argv.length > 8) {
    console.log('Cannot perform option with inputted arguments.')
    process.exit(1)
  }
  let found = 0
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].name.toUpperCase() === nameArg.toUpperCase()) {
      found = 1
    }
  }
  if (found !== 1) {
    console.log('Name does not exist')
    process.exit(1)
  }
  if (sexArg !== 'f' && sexArg !== 'F' && sexArg !== 'm' && sexArg !== 'M') {
    console.log('Incorrect sex')
    process.exit(1)
  }
  if (!(ageArg >= 18)) {
    console.log('Age not a number or underaged')
    process.exit(1)
  }
  if (!(Number(heightArg))) {
    console.log('Height not a number')
    process.exit(1)
  }
  if (!(Number(weightArg))) {
    console.log('Weight not a number')
    process.exit(1)
  }
  const updatedDetails = updateBioFile(data, new Bio(nameArg, sexArg, ageArg, heightArg, weightArg))
  if (updatedDetails !== null) {
    writeCSVFile('biostats.csv', updatedDetails)
    console.log('Updated File Successfully')
  }
}
if (option === '-d') {
  if (nameArg === undefined || process.argv.length > 4) {
    console.log('Cannot perform option with inputted arguments.')
    process.exit(1)
  }
  let found = 0
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].name.toUpperCase() === nameArg.toUpperCase()) {
      found = 1
    }
  }
  if (found !== 1) {
    console.log('Name does not exist')
    process.exit(1)
  }
  writeCSVFile('biostats.csv', deleteBioFile(data, nameArg))
  console.log('Deleted File Successfully')
}
