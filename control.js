

var authenticationDiv = document.getElementById('authenticationDiv');
var loggedIn = document.getElementById('loggedIn');
var userInfo = document.getElementById('userInfo');
var accessDiv = document.getElementById('accessDiv');
var registerDiv = document.getElementById('registerDiv');

var message = document.getElementById('message');
var loading = document.getElementById('loading');

var toggleRegister = document.getElementById('toggleRegister');
var toggleAccess = document.getElementById('toggleAccess');

var accessBtn = document.getElementById('accessBtn');
var registerBtn = document.getElementById('registerBtn');

var githubBtn = document.getElementById('githubBtn');
var googleBtn = document.getElementById('googleBtn');
var anonymousBtn = document.getElementById('anonymousBtn');

var email = document.getElementById('email');
var password = document.getElementById('password');

var userImg = document.getElementById('userImg');
var userName = document.getElementById('userName');
var userEmail = document.getElementById('userEmail');

var logOutBtn = document.getElementById('logOutBtn');

toggleRegister.onclick = function () {
    accessDiv.style.display = 'none';
    registerDiv.style.display = 'block';
}

toggleAccess.onclick = function () {
    registerDiv.style.display = 'none';
    accessDiv.style.display = 'block';
}

function mostrarTarefas(result) {
    authenticationDiv.style.display = 'none';
    if (result.user.isAnonymous) {
        userImg.src = 'imgUserSecret.png';
        userName.innerHTML = 'Usuário anônimo'
    } else {
        if (result.user.photoURL != null) {
            userImg.src = result.user.photoURL;
        }
    
        if (result.user.displayName != null) {
            userName.innerHTML = result.user.displayName;
        }
    
        if (result.user.email != null) {
            userEmail.innerHTML = result.user.email;
        }
    }
    loggedIn.style.display = 'block';
    console.log(result);
    loading.style.display = 'none';
}

accessBtn.onclick = function () {
    loading.style.display = 'inline';
    message.style.display = 'none';
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then(function (result) {
            mostrarTarefas(result);
        })
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
        .then(function (result) {
            mostrarTarefas(result);
        })
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
        .then(function () {
            loggedIn.style.display = 'none';
            email.value = '';
            password.value = '';
            authenticationDiv.style.display = 'block';
            alert('Você saiu');
        }, function (error) {
            console.error(error.code);
            alert("Houve um problema:" + error.code + error.message);
        });
}

anonymousBtn.onclick = function() {
    loading.style.display = 'inline';
    firebase.auth().signInAnonymously()
    .then(function(result) {
        mostrarTarefas(result);
    })
    .catch(function(error) {
        console.error(error.code);
        console.error(error.message);
        alert('Falha ao autenticar...');
    });
}

githubBtn.onclick = function() {
    let provider = new firebase.auth.GithubAuthProvider();
    signIn(provider);
}

googleBtn.onclick = function() {
    let provider = new firebase.auth.GoogleAuthProvider();
    signIn(provider);
}

function signIn(provider) {
    loading.style.display = 'inline';
    firebase.auth().signInWithPopup(provider)
    .then(function(result) {
        mostrarTarefas(result);
        console.log(result);
        var token = result.credential.accessToken;
    })
    .catch(function(error) {
        console.log(error);
        alert('Falha na autenticação');
    });
}

/*
// Storage
let uploader = document.getElementById('uploader');
let fileButton = document.getElementById('fileButton');

fileButton.addEventListener('change', function(e) {
    alert("alterou");
    var file = e.target.files[0];

    var storageRef = firebase.storage().ref('arquivos/' + file.name);

    var task = storageRef.put(file);

    task.on('state_changed',
        function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.value = percentage;
        },
        function error(err) {
            console.log(err);
        },
        function complete() {
            alert('Envio completo!');
        }
    )
})
*/
// realTimeDatabase
var todoList = document.getElementById('todoList');
var priority = document.getElementById('priority');
var todo = document.getElementById('todo');
var addButton = document.getElementById('addButton');

addTodoBtn.onclick = function() {
    var data = {
        todo: todo.value,
        priority: priority.value
    }
    return firebase.database().ref().child('todoList').push(data);
}

firebase.database().ref('todoList').on('value', function (snap) {
    todoList.innerHTML = '';
    snap.forEach(function (item) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(item.val().todo + ' : ' + item.val().priority));
        todoList.appendChild(li);
    });
});