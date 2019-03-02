// firebase.database.enableLogging(function(message) {
//     console.log('Firebase logging: ' + message)
// })

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
  loading.style.display = 'none'
}

toggleRegisterBtn.onclick = function () {
  authForm.submitAuth.innerHTML = 'Cadastrar conta'
  credentialsFormTitle.innerHTML = 'Informe os dados para continuar'
  toggleAccess.style.display = 'block'
  toggleRegister.style.display = 'none'
  resetPassword.style.display = 'none'
}

toggleAccessBtn.onclick = function () {
  authForm.submitAuth.innerHTML = 'Acessar'
  credentialsFormTitle.innerHTML = 'Acesse sua conta para continuar'
  toggleAccess.style.display = 'none'
  toggleRegister.style.display = 'block'
  resetPassword.style.display = 'block'
}


function showSignedOut() {
  hideItem(signedIn)
  /*hideItem(inputs)
  hideItem(userInfo)
  hideItem(publicTodoList)
  hideItem(privateTodoList)
  hideItem(addTodo)
  hideItem(updateTodoBtns)
  showItem(authentication)*/
  email.value = ''
  password.value = ''
  showItem(signedOut)
  hideItem(loading)
}

function showSignedIn() {
  hideItem(signedOut)
  showItem(signedIn)
  hideItem(loading)
  /*addUpdateTodoText.innerHTML = 'Adicionar tarefa:'
  hideItem(authentication)
  hideItem(updateTodoBtns)
  hideItem(uploaderFeedback)
  if (canEditTodoList) {
    showItem(inputs)
    showItem(addTodo)
    showItem(privateCheckBox)
    showItem(privateTodoList)
  }
  */
  showItem(userInfo)
  /*
  todo.value = ''
  fileBtn.value = ''*/
  hideItem(loading)
}

// var database = firebase.database()

// console.log(database)

// //.child(uid).orderByChild('todo')


/*

{
   Visit https://firebase.google.com/docs/database/security to learn more about security rules. 
  "rules": {
    "publicTodoList": {
      ".read": true,
      ".write": true
    },
    "privateTodoList": {
      ".read": true,
      ".write": true
    }
  }
}

*/