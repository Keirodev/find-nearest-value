document.getElementById('submit').addEventListener('click', event => {
  // avoid native submit page reload
  event.preventDefault()
  toggleDisplayError()

  // check if both fields are filled (target & values)
  const target = Number(document.getElementById('target').value)
  const values = document.getElementById('values').value

  if (target === 0 || isNaN(target) || values === '') {
    // erreur
    toggleDisplayError('Champs remplis incorrectement')
    return;
  }

  // extract values as 0000-xxxx


})


function toggleDisplayError(message) {
  const errorDiv = document.getElementById('alert-danger')

  if (!!!message) {
    // hide
    errorDiv.style.display = 'none'
    errorDiv.innerText = ''
  } else {
    //display
    errorDiv.style.display = 'block'
    errorDiv.innerText = message
  }


}
