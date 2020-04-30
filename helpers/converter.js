module.exports = (dms) => {
  //convert degrees minutes seconds to degrees decimal minutes
  //accepts dms in the following format: DD MM SS.s P
  //returns DD MM.m P

  const split = dms.split(' ')
  const m = parseFloat(split[2]) / 60
  const Mm = parseFloat(parseInt(split[1]) + m).toFixed(3)
  return `${split[0]} ${Mm} ${split[3]}`
}
