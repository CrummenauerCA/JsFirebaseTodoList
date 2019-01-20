firebase.auth().languageCode = 'pt-BR';

accessBtn.onclick = function () {
    loading.style.display = 'inline';
    message.style.display = 'none';
    firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function (error) {
        console.log(error);
        message.style.color = 'red';
        message.innerHTML = 'Erro ao cadastrar! E-mail inválido ou já cadastrado ou senha com menos de 6 caracteres';
        message.style.display = 'block';
        loading.style.display = 'none';
    });
}

registerBtn.onclick = function () {
    loading.style.display = 'inline';
    message.style.display = 'none';
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then(function (user) {
        sendEmailVerification();
    }).catch(function (error) {
        console.log(error);
        message.style.color = 'red';
        message.innerHTML = 'Erro ao cadastrar! E-mail inválido ou já cadastrado ou senha com menos de 6 caracteres';
        message.style.display = 'block';
        loading.style.display = 'none';
    });
}

function sendEmailVerification() {
    var user = firebase.auth().currentUser;
    var actionCodeSettings = {
        url: 'http://127.0.0.1:5500/'
    };
    user.sendEmailVerification(actionCodeSettings).then(function () {
        alert('E-mail de verificação enviado, verifique sua caixa de entrada');
    }).catch(function (error) {
        showError(error, 'Houve um erro ao enviar um e-mail de verificação para você');
    });
}

logOutBtn.onclick = function () {
    firebase.auth().signOut().catch(function (error) {
        showError(error, 'Falha ao sair de sua conta');
    });
}

anonymousBtn.onclick = function () {
    loading.style.display = 'inline';
    firebase.auth().signInAnonymously().catch(function (error) {
        showError(error, 'Falha na autenticação como anônimo');
    });
}

githubBtn.onclick = function () {
    loading.style.display = 'inline';
    firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider()).catch(function (error) {
        showError(error, 'Falha na autenticação com o Github');
    });
}

googleBtn.onclick = function () {
    loading.style.display = 'inline';
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (error) {
        showError(error, 'Falha na autenticação com o Google');
    });
}

function showError(error, message) {
    console.log(error);
    alert(message);
    loading.style.display = 'none';
}

var canEditTodoList = true;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user);
        authentication.style.display = 'none';
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
            userEmailVerified.innerHTML = user.emailVerified ? 'E-mail verificado' : 'E-mail não verificado, um e-mail de verificação foi enviado...';
            canEditTodoList = true;
        }
        dbObject.orderByChild('todo').once('value', function (dataSnapshot) {
            fillTodoList(dataSnapshot);
        });
        if (canEditTodoList) {
            inputs.style.display = 'block';
        }
        todoList.style.display = 'block';
        userInfo.style.display = 'block';
    } else {
        userInfo.style.display = 'none';
        inputs.style.display = 'none';
        todoList.style.display = 'none';
        email.value = '';
        password.value = '';
        authentication.style.display = 'block';
    }
    loading.style.display = 'none';
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
}