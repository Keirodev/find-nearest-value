/**
 * Main process that format values, enrich final result and assiqn rewards
 * @param values
 * @param targetValue
 * @return {(*&{delta: number})[]}
 */
function processValues(values, targetValue) {

  const regexp = /([0-9]{1,10}-[A-zÀ-ú0-9]+)/g
  const valuesExtracted = values.split(regexp)
  const cleanedValue = valuesExtracted
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

  // add position and rewards
  const rewardsRaw = document.getElementById('rewards').value
  const rewardsSplitted = rewardsRaw.split(/\n/g)
  // add each reward line to the ordered value lists
  let previousResult
  let position = 1;
  results.forEach(result => {
    // same score ? => same reward and same position
    if (previousResult !== undefined && result.score === previousResult.score) {
      position--
      result.position = position
      result.reward = previousResult.reward
    } else {
      result.position = position
      result.reward = rewardsSplitted.length ? rewardsSplitted.shift() : false
    }

    position++
    previousResult = result
  })

  return results
}

function generatePositionContent(position) {
  return (position < 4)
    ? `<i class="fa-solid fa-star position-${position}"></i>`.repeat(position)
    : position
}

function addResultsToDom(data) {
  const domResults = data.map(result => `
        <div class="row">
          <div class="col-3">${generatePositionContent(result.position)}</div>
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

function copyResultToClipboard(target, data) {
  data.unshift(`Cible : ${target}\n`)
  const resultForClipboard = data.map((result, index) => {

    if (index === 0) return result

    const rewardFormatted = result.reward ? ` Gain : ${result.reward}` : ''
    return `${index} : ${result.name} avec ${result.score} (≠ de ${result.delta})${rewardFormatted}`

  }).join('\n')

  // copy to clipboard
  navigator.clipboard.writeText(resultForClipboard);
  toggleDisplayInfo('Résultats copiés dans ton presse-papier', 'alert-success')
}

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

// save automatically fields to localstorage if edited
const fieldsIdToRecord = ['target', 'values', 'rewards']
fieldsIdToRecord.forEach(id => {
  const tag = document.getElementById(id)
  tag.addEventListener('input', () => localStorage.setItem(id, tag.value))
})

// load content stored in localstorage
fieldsIdToRecord.forEach(id => {
  const dataFromLocalstorage = localStorage.getItem(id)
  if (dataFromLocalstorage) document.getElementById(id).value = dataFromLocalstorage
})

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
  copyResultToClipboard(target, valuesFormatted)


})

// Allow multilines thru programmation for textarea simulating an edit
Array.prototype.forEach.call(document.getElementsByTagName('textarea'), function (elem) {
  elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
});


/*

Mock for localhost

*/

function addMock() {
  const target = '1175'
  const values = `4196-Pac 6512-Hono 3814-Minou 8765-Spike 8500-Cheyenne 7988-Toffy 25000-Brave 3333-Cerraand 5000-Masuya 3281-Nico 3245-Valhala 180-Poponews 350-Bau 350-Png 700-CLIO 1400-BRAHMS`
  const rewards = `2000\r\n1000\r\n500\r\n250\r\n125\r\n75\r\n50`


  document.getElementById('target').value = target
  document.getElementById('values').innerText = values
  document.getElementById('rewards').value = rewards
}

if (window.location.host.indexOf('localhost') >= 0) addMock()
