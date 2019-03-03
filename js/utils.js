// firebase.database.enableLogging(function(message) {
//     console.log('Firebase logging: ' + message)
// })

var database = firebase.database()

var actionCodeSettings = {
  url: 'http://127.0.0.1:5500/'
}

function showItem(element) {
  element.style.display = 'block'
}

function hideItem(element) {
  element.style.display = 'none'
}

function showError(error, message) {
  console.log(error)
  alert(message)
  hideItem(loading)
}

toggleRegisterBtn.onclick = function () {
  authForm.submitAuth.innerHTML = 'Cadastrar conta'
  credentialsFormTitle.innerHTML = 'Informe os dados para continuar'
  showItem(toggleAccess)
  hideItem(toggleRegister)
  hideItem(resetPassword)
}

toggleAccessBtn.onclick = function () {
  authForm.submitAuth.innerHTML = 'Acessar'
  credentialsFormTitle.innerHTML = 'Acesse sua conta para continuar'
  hideItem(toggleAccess)
  showItem(toggleRegister)
  showItem(resetPassword)
}

function showSignedOut() {
  hideItem(signedIn)
  showItem(signedOut)
  hideItem(loading)
}

function showSignedIn() {
  hideItem(signedOut)
  showItem(signedIn)
  todoForm.submitTodo.style.display = 'initial'
  addUpdateTodoText.innerHTML = 'Adicionar tarefa:'
  todoForm.submitTodo.innerHTML = 'Adicionar tarefa'
  hideItem(cancelUpdateTodo)
  hideItem(progressFeedback)
  todo.value = ''
  fileBtn.value = ''
  hideItem(loading)
}
