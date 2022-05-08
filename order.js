/*

Testing Data

2332-Spike
232-Nico
190910-Brahms34
140910-Pac

*/

const textAreas = document.getElementsByTagName('textarea');

Array.prototype.forEach.call(textAreas, function(elem) {
  elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
});

function processValues(values, targetValue) {

  const regexp = /([0-9]{1,10}-[A-zÀ-ú0-9]+)/g
  const splitedValue = values.split(regexp)
  const cleanedValue = splitedValue
    .filter(value => regexp.test(value))
    .map(value => {
      let score, name;
      [score, name] = value.split('-')
      return {score: Number(score), name}
    })

  // now let's order
  cleanedValue.sort((a, b) => Math.abs(targetValue - Number(a.score)) - Math.abs(targetValue - Number(b.score)))
  // add ≠ to targetValue
  const results = cleanedValue.map(item => {
    return {
      ...item,
      delta: Math.abs(item.score - targetValue)
    }
  })

  // add rewards
  const rewardsRaw = document.getElementById('rewards').value
  const rewardsSplitted = rewardsRaw.split(/\n/g)
  console.log('rewardsSplitted', rewardsSplitted)
  // add each reward line to the ordered value lists
  results.forEach(result => {
    result.reward = rewardsSplitted.length ? rewardsSplitted.shift() : false
  })

  return results
}

function addResultsToDom(data) {
  const domResults = data.map((result, index) => `
        <div class="row">
          <div class="col-3">${index + 1}</div>
          <div class="col-3">${result.name}</div>
          <div class="col-3">${result.score} (≠ ${result.delta})</div>
          <div class="col-3">${result.reward ? result.reward : ''}</div>
        </div>
    `)

  domResults.unshift(`<div class="row">
          <div class="col-3">Position</div>
          <div class="col-3">Nom</div>
          <div class="col-3">Estimation</div>
          <div class="col-3">Récompense</div>
        </div>`)

  document.getElementById('results').innerHTML = domResults.join('');
}

function copyResultToClipboard(data) {
  const resultForClipboard = data.map((result, index) => {
    const rewardFormatted = result.reward ? ` Gain : ${result.reward}` : ''
    return `${index + 1} : ${result.name} avec ${result.score} (≠ de ${result.delta})${rewardFormatted}`
  }).join('\n')

  // copy to clipboard
  navigator.clipboard.writeText(resultForClipboard);
  toggleDisplayInfo('Résultats copiés dans ton presse-papier', 'alert-success')
}

document.getElementById('submit').addEventListener('click', event => {
  // avoid native submit page reload
  event.preventDefault()

  // (re-)initialize info block
  toggleDisplayInfo(null, 'alert-danger')
  toggleDisplayInfo(null, 'alert-success')

  // check if both required fields are filled (target & values)
  const target = Number(document.getElementById('target').value)
  const values = document.getElementById('values').value

  if (target === 0 || isNaN(target) || values === '') {
    // erreur
    toggleDisplayInfo('Champs remplis incorrectement', 'alert-danger')
    return;
  }

  // extract values as 0000-xxxx
  const valuesFormatted = processValues(values, target)

  // add results to dom
  addResultsToDom(valuesFormatted)
  // format data for clipboard
  copyResultToClipboard(valuesFormatted)


})

function toggleDisplayInfo(message, classname) {
  const divWanted = document.getElementById(classname)

  if (!!!message) {
    // hide
    divWanted.style.display = 'none'
    divWanted.innerText = ''
  } else {
    //display
    divWanted.style.display = 'block'
    divWanted.innerText = message
  }


}
