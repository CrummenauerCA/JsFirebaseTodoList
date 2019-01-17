accessBtn.onclick = function () {
    loading.style.display = 'inline';
    message.style.display = 'none';
    firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function (error) {
        console.log(error);
        message.style.color = 'red';
        message.innerHTML = 'E-mail ou senha incorretos!';
        message.style.display = 'block';
        loading.style.display = 'none';
    });
}

registerBtn.onclick = function () {
    loading.style.display = 'inline';
    message.style.display = 'none';
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value).catch(function (error) {
        console.log(error);
        message.style.color = 'red';
        message.innerHTML = 'Erro ao cadastrar! Cerifique-se de usar um e-mail válido e uma senha com ao menos 6 caracteres';
        message.style.display = 'block';
        loading.style.display = 'none';
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
        authentication.style.display = 'none';
        if (user.isAnonymous) {
            userImg.src = 'img/userSecret.png';
            userName.innerHTML = 'Usuário anônimo'
            userEmail.innerHTML = '';
            canEditTodoList = false;
        } else {
            userImg.src = user.photoURL ? user.photoURL : 'img/userUnknown.png';
            userName.innerHTML = user.displayName ? user.displayName : '';
            userEmail.innerHTML = user.email ? user.email : '';
        }
        inputs.style.display = 'block';
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