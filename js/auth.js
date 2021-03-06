firebase.auth().useDeviceLanguage()

authForm.onsubmit = function (event) {
  event.preventDefault()
  showItem(loading)
  if (authForm.submitAuth.innerHTML == 'Acessar') {
    firebase.auth().signInWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
      showError(error, 'Erro ao acessar! E-mail ou senha inválidos')
    })
  } else {
    firebase.auth().createUserWithEmailAndPassword(authForm.email.value, authForm.password.value).catch(function (error) {
      showError(error, 'Erro ao cadastrar! E-mail inválido ou já cadastrado ou senha com menos de 6 caracteres')
    })
  }
}

resetPasswordBtn.onclick = function () {
  var email = prompt('Redefinir senha! Informe o seu endereço de email!', authForm.email.value)
  if (email) {
    showItem(loading)
    firebase.auth().sendPasswordResetEmail(email, actionCodeSettings).then(function () {
      hideItem(loading)
      alert('Um e-mail para redefinir a senha foi enviado para ' + email.value)
    }).catch(function (error) {
      showError(error, 'Erro ao enviar o e-mail de redefinição de senha! Verifique o e-mail informado e tente novamente...')
    })
  } else {
    alert('É preciso preencher o campo de e-mail para redefinir a senha!')
  }
}

function sendEmailVerification() {
  firebase.auth().currentUser.sendEmailVerification(actionCodeSettings).then(function () {
    alert('E-mail de verificação enviado, verifique sua caixa de entrada')
  }).catch(function (error) {
    showError(error, 'Houve um erro ao enviar um e-mail de verificação para você')
  })
}

facebook.onclick = function () {
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider()).catch(function (error) {
    showError(error, 'Falha na autenticação com o Facebook')
  })
}

github.onclick = function () {
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).catch(function (error) {
    showError(error, 'Falha na autenticação com o Github')
  })
}

google.onclick = function () {
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (error) {
    showError(error, 'Falha na autenticação com o Google')
  })
}

removeAccountBtn.onclick = function () {
  var confirmation = confirm('Realmente deseja excluir sua conta?')
  if (confirmation == true) {
    var user = firebase.auth().currentUser
    user.delete().then(function () {
      alert('Conta apagada com sucesso!')
    }).catch(function (error) {
      showError(error, 'Houve um erro ao apagar a sua conta...')
    })
  }
}

function updateUserName() {
  var newUserName = prompt('Informe um novo nome de usuário', userName.innerHTML)
  if (newUserName != null) {
    if (newUserName != '') {
      userName.innerHTML = newUserName
      firebase.auth().currentUser.updateProfile({
        displayName: newUserName,
      }).catch(function (error) {
        showError(error, 'Erro ao editar o usuário!')
      })
    } else {
      alert('O nome não pode ser vazio!')
    }
  }
}

logOutBtn.onclick = function () {
  showItem(loading)
  firebase.auth().signOut().catch(function (error) {
    showError(error, 'Falha ao sair de sua conta')
  })
}

var uid = '0'
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    uid = firebase.auth().currentUser.uid
    userImg.src = user.photoURL ? user.photoURL : 'img/userUnknown.png'
    userName.innerHTML = user.displayName ? user.displayName : ''
    userEmail.innerHTML = user.email
    if (!user.emailVerified) {
      var provider = user.providerData[0].providerId
      if (provider != 'password') {
        userEmailVerified.innerHTML = 'Login feito através de ' + provider + ', não é necessário verificar o e-mail'
      } else {
        userEmailVerified.innerHTML = '<b>E-mail não verificado</b>!'
        sendEmailVerification()
      }
    } else {
      userEmailVerified.innerHTML = 'E-mail verificado'
    }
    database.ref('todoList/' + uid).on('value', function (dataSnapshot) {
      fillTodoList(dataSnapshot)
    })
    showSignedIn();
  } else {
    showSignedOut()
  }
})