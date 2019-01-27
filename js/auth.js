firebase.auth().useDeviceLanguage();

accessBtn.onclick = function() {
    showItem(loading);
    firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function(error) {
        showError(error, 'Erro ao acessar! E-mail ou senha inválidos');
    });
}

resetPasswordBtn.onclick = function() {
    showItem(loading);
    if (email.value != '') {
        firebase.auth().sendPasswordResetEmail(email.value, actionCodeSettings).then(function() {
            hideItem(loading);
            alert('Email para recuperar a senha enviado...');
        }).catch(function(error) {
            hideItem(loading);
            showError(error, 'Erro ao enviar o e-mail de recuperação de senha! Verifique o e-mail informado e tente novamente...');
        });
    }
}

registerBtn.onclick = function() {
    showItem(loading);
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(function(user) {
        sendEmailVerification();
    }).catch(function(error) {
        showError(error, 'Erro ao cadastrar! E-mail inválido ou já cadastrado ou senha com menos de 6 caracteres');
    });
}

function sendEmailVerification() {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification(actionCodeSettings).then(function() {
        alert('E-mail de verificação enviado, verifique sua caixa de entrada');
    }).catch(function(error) {
        showError(error, 'Houve um erro ao enviar um e-mail de verificação para você');
    });
}

logOutBtn.onclick = function() {
    showItem(loading);
    firebase.auth().signOut().catch(function(error) {
        showError(error, 'Falha ao sair de sua conta');
    });
}

anonymousBtn.onclick = function() {
    showItem(loading);
    firebase.auth().signInAnonymously().catch(function(error) {
        showError(error, 'Falha na autenticação como anônimo');
    });
}

githubBtn.onclick = function() {
    showItem(loading);
    firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).catch(function(error) {
        showError(error, 'Falha na autenticação com o Github');
    });
}

googleBtn.onclick = function() {
    showItem(loading);
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function(error) {
        showError(error, 'Falha na autenticação com o Google');
    });
}

var canEditTodoList = true;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user.uid);
        hideItem(authentication);
        if (user.isAnonymous) {
            userImg.src = 'img/userSecret.png';
            userName.innerHTML = 'Usuário anônimo';
            userEmail.innerHTML = '';
            userEmailVerified.innerHTML = '';
            canEditTodoList = false;
        } else {
            userImg.src = user.photoURL ? user.photoURL : 'img/userUnknown.png';
            userName.innerHTML = user.displayName ? user.displayName : '';
            userEmail.innerHTML = user.email ? user.email : '';
            userEmailVerified.innerHTML = user.emailVerified ? 'E-mail verificado' : 'E-mail não verificado, não poderá alterar a lista até fazer essa verificação...';
            canEditTodoList = true;
        }
        if (!user.emailVerified) {
            canEditTodoList = false;
            sendEmailVerification();
        }
        dbObject.orderByChild('todo').once('value', function(dataSnapshot) {
            fillTodoList(dataSnapshot);
        });
        if (canEditTodoList) {
            showItem(inputs);
        }
        showItem(userInfo);
        showItem(inputs);
        showItem(todoList);
        showItem(addTodoBtnDiv);
    } else {
        hideItem(inputs);
        hideItem(userInfo);
        hideItem(todoList);
        email.value = '';
        password.value = '';
        showItem(authentication);
    }
    hideItem(loading);
});

removeAccountBtn.onclick = function() {
    var confirmation = confirm('Realmente deseja excluir sua conta?');
    if (confirmation == true) {
        var user = firebase.auth().currentUser;
        user.delete().then(function() {
            alert('Conta apagada com sucesso!');
        }).catch(function(error) {
            showError(error, 'Houve um erro ao apagar a sua conta...');
        });
    }
}