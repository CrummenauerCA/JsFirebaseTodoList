var authenticationDiv = document.getElementById('authenticationDiv');
var loggedIn = document.getElementById('loggedIn');
var userInfo = document.getElementById('userInfo');
var accessDiv = document.getElementById('accessDiv');
var registerDiv = document.getElementById('registerDiv');

var message = document.getElementById('message');
var loading = document.getElementById('loading');
var loadingTodoList = document.getElementById('loadingTodoList');
var loadingTodoListGeneral = document.getElementById('loadingTodoListGeneral');

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

// var token = result.credential.accessToken;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log(user);
        authenticationDiv.style.display = 'none';
        if (user.isAnonymous == true) {
            userImg.src = 'imgUserSecret.png';
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

const dbObject = firebase.database().ref().child('todoList');

addTodoBtn.onclick = function () {
    var data = {
        todo: todo.value,
        priority: priority.value
    }
    return dbObject.push(data);
}

dbObject.orderByChild('todo').on('value', function (dataSnapshot) {
    console.log(dataSnapshot.val());
    todoList.innerHTML = '';
    dataSnapshot.forEach(function (item) {
        var value = item.val();
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(value.todo + ' : ' + value.priority + ' '));
        var liRemoveBtn = document.createElement('button');
        liRemoveBtn.appendChild(document.createTextNode('x'));
        liRemoveBtn.setAttribute('onclick', `removerTarefa(\"${item.key}\")`);
        liRemoveBtn.setAttribute('class', 'remove');
        li.appendChild(liRemoveBtn);
        todoList.appendChild(li);
    });
    loadingTodoList.style.display = 'none';
});

function removerTarefa(key) {
    dbObject.child(key).remove();
}

/*
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
*/