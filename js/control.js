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

// realTimeDatabase
var todoList = document.getElementById('todoList');
var priority = document.getElementById('priority');
var todo = document.getElementById('todo');
var addButton = document.getElementById('addButton');

const dbObject = firebase.database().ref().child('todoList');

addTodoBtn.onclick = function () {
    var url = '';
    let uploaderFeedback = document.getElementById('uploaderFeedback');
    let fileBtn = document.getElementById('fileBtn');
    var file = fileBtn.files[0];
    var storageRef = firebase.storage().ref('arquivos/' + file.name);
    var uploadTask = storageRef.put(file)
    uploadTask.on('state_changed',
        function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploaderFeedback.style.display = 'inline';
            uploaderFeedback.value = progress;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function (error) {
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;

                case 'storage/canceled':
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        }, function () {
            // Upload completed successfully, now we can get the download URL
            var imgUpload = document.getElementById('imgUpload');
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log('File available at', downloadURL);
                imgUpload.src = downloadURL;
                url = downloadURL;
            });
        });

    var data = {
        todo: todo.value,
        priority: priority.value,
        imgUrl: url
    }
    uploaderFeedback.style.display = 'none';
    return dbObject.push(data);
}

dbObject.orderByChild('todo').on('value', function (dataSnapshot) {
    console.log(dataSnapshot.val());
    todoList.innerHTML = '';
    dataSnapshot.forEach(function (item) {
        var value = item.val();
        var li = document.createElement('li');

        var pLi = document.createElement('p');
        pLi.appendChild(document.createTextNode(value.todo + ' : ' + value.priority + ' '));
        pLi.id = item.key;
        pLi.setAttribute('class', 'todoItemList');
        li.appendChild(pLi);

        var liRemoveBtn = document.createElement('button');
        liRemoveBtn.appendChild(document.createTextNode('X'));
        liRemoveBtn.setAttribute('onclick', `removeTodo(\"${item.key}\")`);
        liRemoveBtn.setAttribute('title', 'Remover esta tarefa');
        liRemoveBtn.setAttribute('class', 'removeBtn');
        li.appendChild(liRemoveBtn);

        var liUpdateBtn = document.createElement('button');
        liUpdateBtn.appendChild(document.createTextNode('A'));
        liUpdateBtn.setAttribute('onclick', `updateTodo(\"${item.key}\")`);
        liUpdateBtn.setAttribute('title', 'Atualizar usando os dados do formulário');
        liUpdateBtn.setAttribute('class', 'updateBtn');
        li.appendChild(liUpdateBtn);

        todoList.appendChild(li);
    });
    loadingTodoList.style.display = 'none';
});

function removeTodo(key) {
    var liSelected = document.getElementById(key);
    var confirmation = confirm('Realmente deseja remover (' + liSelected.innerHTML + ')');
    if (confirmation == true) {
        dbObject.child(key).remove();
    }
}

function updateTodo(key) {
    if (todo.value != '') {
        var liSelected = document.getElementById(key);
        var confirmation = confirm('Realmente deseja atualizar de (' + liSelected.innerHTML + ') para (' + todo.value + ' : ' + priority.value + ')');
        if (confirmation == true) {
            var data = {
                todo: todo.value,
                priority: priority.value
            }
            dbObject.child(key).update(data);
        }
    } else {
        alert('O formulário não pode estar vazio para atualizar a tarefa!');
    }
}