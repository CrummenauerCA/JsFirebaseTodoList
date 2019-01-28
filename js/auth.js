firebase.auth().useDeviceLanguage();

registerBtn.onclick = function () {
    showItem(loading);
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value).catch(function (error) {
        showError(error, 'Erro ao cadastrar! E-mail inválido ou já cadastrado ou senha com menos de 6 caracteres');
    });
};

accessBtn.onclick = function () {
    showItem(loading);
    firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function (error) {
        showError(error, 'Erro ao acessar! E-mail ou senha inválidos');
    });
};

resetPasswordBtn.onclick = function () {
    if (email.value != '') {
        showItem(loading);
        firebase.auth().sendPasswordResetEmail(email.value, actionCodeSettings).then(function () {
            hideItem(loading);
            alert('Email para redefinir a senha enviado para ' + email.value);
        }).catch(function (error) {
            showError(error, 'Erro ao enviar o e-mail de redefinição de senha! Verifique o e-mail informado e tente novamente...');
        });
    } else {
        alert('É preciso preencher o campo de senha para redefinir a senha!');
    }
};

function sendEmailVerification() {
    firebase.auth().currentUser.sendEmailVerification(actionCodeSettings).then(function () {
        alert('E-mail de verificação enviado, verifique sua caixa de entrada');
    }).catch(function (error) {
        showError(error, 'Houve um erro ao enviar um e-mail de verificação para você');
    });
}

logOutBtn.onclick = function () {
    showItem(loading);
    firebase.auth().signOut().catch(function (error) {
        showError(error, 'Falha ao sair de sua conta');
    });
};

anonymousBtn.onclick = function () {
    showItem(loading);
    firebase.auth().signInAnonymously().catch(function (error) {
        showError(error, 'Falha na autenticação como anônimo');
    });
};

githubBtn.onclick = function () {
    showItem(loading);
    firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).catch(function (error) {
        showError(error, 'Falha na autenticação com o Github');
    });
};

googleBtn.onclick = function () {
    showItem(loading);
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (error) {
        showError(error, 'Falha na autenticação com o Google');
    });
};

logOutBtn.onclick = function () {
    showItem(loading);
    firebase.auth().signOut().catch(function (error) {
        showError(error, 'Falha ao sair de sua conta');
    });
};

var canEditTodoList = true;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user.uid);
        hideItem(authentication);
        if (user.isAnonymous) {
            userImg.src = 'img/userSecret.png';
            userName.innerHTML = '<b>Usuário anônimo</b>, você só pode visualizar a lista!';
            userEmail.innerHTML = '';
            userEmailVerified.innerHTML = '';
            canEditTodoList = false;
        } else {
            userImg.src = user.photoURL ? user.photoURL : 'img/userUnknown.png';
            userName.innerHTML = user.displayName ? user.displayName : '';
            userEmail.innerHTML = user.email ? user.email : '';
            userEmailVerified.innerHTML = user.emailVerified ? 'E-mail verificado' : '<b>E-mail não verificado</b>, você só pode visualizar a lista enquanto não fizer essa verificação!';
            canEditTodoList = true;

            if (!user.emailVerified) {
                canEditTodoList = false;
                sendEmailVerification();
            }
        }

        dbObject.orderByChild('todo').once('value', function (dataSnapshot) {
            fillTodoList(dataSnapshot);
        });
        
        if (canEditTodoList) {
            showItem(inputs);
            showItem(addTodo);
        }
        showItem(userInfo);
        showItem(todoList);
    } else {
        hideItem(inputs);
        hideItem(userInfo);
        hideItem(todoList);
        hideItem(addTodoBtn);
        showItem(authentication);
        email.value = '';
        password.value = '';
    }
    hideItem(loading);
});

removeAccountBtn.onclick = function () {
    var confirmation = confirm('Realmente deseja excluir sua conta?');
    if (confirmation == true) {
        var user = firebase.auth().currentUser;
        user.delete().then(function () {
            alert('Conta apagada com sucesso!');
        }).catch(function (error) {
            showError(error, 'Houve um erro ao apagar a sua conta...');
        });
    }
};