/*

Testing Data

2332-Spike
232-Nico
190910-Brahms34
140910-Pac


 */


document.getElementById('submit').addEventListener('click', event => {
  // avoid native submit page reload
  event.preventDefault()
  toggleDisplayInfo(null, 'alert-danger')
  toggleDisplayInfo(null, 'alert-success')

  // check if both fields are filled (target & values)
  const target = Number(document.getElementById('target').value)
  const values = document.getElementById('values').value

  if (target === 0 || isNaN(target) || values === '') {
    // erreur
    toggleDisplayInfo('Champs remplis incorrectement', 'alert-danger')
    return;
  }

  // extract values as 0000-xxxx
  const splittedValue = values.split(/([0-9]{1,10}-\w+)/gm)
  const cleanedValue = splittedValue
    .filter(value => /([0-9]{1,10}-\w+)/g.test(value))
    .map(value => {
      let score, name;
      [score, name] = value.split('-')
      return {score: Number(score), name}
    })

  // now let's order
  cleanedValue.sort((a, b) => Math.abs(target - Number(a.score)) - Math.abs(target - Number(b.score)))
  // add ≠ to target
  const results = cleanedValue.map(item => {
    return {
      ...item,
      delta: Math.abs(item.score - target)
    }
  })

  // add results to dom
  const domResults = results.map((result, index) => `
        <div class="row">
          <div class="col-3">${index + 1}</div>
          <div class="col-3">${result.name}</div>
          <div class="col-3">${result.score}</div>
          <div class="col-3">${result.delta}</div>
        </div>
    `)

  domResults.unshift(`<div class="row">
          <div class="col-3">Position</div>
          <div class="col-3">Nom</div>
          <div class="col-3">Estimation</div>
          <div class="col-3">Différence</div>
        </div>`)

  document.getElementById('results').innerHTML = domResults.join('');

  // format data for clipboard
  const resultForClipboard = results.map((result, index) => {
    return `${index + 1} : ${result.name} avec ${result.score} (≠ de ${result.delta})`
  }).join('\n')

  // copy to clipboard
  navigator.clipboard.writeText(resultForClipboard);
  toggleDisplayInfo('Résultats copié dans ton press-papier', 'alert-success')


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



// TODO : input pour les gains
