accessBtn.onclick = function () {
    loading.style.display = 'inline';
    message.style.display = 'none';
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .catch(function (error) {
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
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .catch(function (error) {
            console.log(error);
            message.style.color = 'red';
            message.innerHTML = 'Erro ao cadastrar! Cerifique-se de usar um e-mail válido e uma senha com ao menos 6 caracteres';
            message.style.display = 'block';
            loading.style.display = 'none';
        });
}

logOutBtn.onclick = function () {
    firebase.auth().signOut()
        .catch(function (error) {
            console.log(error);
            alert('Falha ao sair');
        });
}

anonymousBtn.onclick = function () {
    loading.style.display = 'inline';
    firebase.auth().signInAnonymously()
        .catch(function (error) {
            console.log(error);
            alert('Falha na autenticação');
            loading.style.display = 'none';
        });
}

githubBtn.onclick = function () {
    loading.style.display = 'inline';
    firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
        .catch(function (error) {
            console.log(error);
            alert('Falha na autenticação');
            loading.style.display = 'none';
        });
}

googleBtn.onclick = function () {
    loading.style.display = 'inline';
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .catch(function (error) {
            console.log(error);
            alert('Falha na autenticação');
            loading.style.display = 'none';
        });
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log(user);
        authenticationDiv.style.display = 'none';
        if (user.isAnonymous == true) {
            userImg.src = 'img/userSecret.png';
            userName.innerHTML = 'Usuário anônimo'
        } else {
            if (user.photoURL != null) {
                userImg.src = user.photoURL;
            }

            if (user.displayName != null) {
                userName.innerHTML = user.displayName;
            }

            if (user.email != null) {
                userEmail.innerHTML = user.email;
            }
        }
        loggedIn.style.display = 'block';
        loading.style.display = 'none';
    } else {
        loggedIn.style.display = 'none';
        email.value = '';
        password.value = '';
        authenticationDiv.style.display = 'block';
    }
    loadingTodoListGeneral.style.display = 'none';
});