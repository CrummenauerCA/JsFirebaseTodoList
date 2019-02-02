// firebase.database.enableLogging(function (message) {
//     console.log('Firebase logging: ' + message);
// });

function showItem(element) {
    element.style.display = 'block';
}

function hideItem(element) {
    element.style.display = 'none';
}

function showError(error, message) {
    console.log(error);
    alert(message);
    loading.style.display = 'none';
}

toggleRegister.onclick = function () {
    access.style.display = 'none';
    register.style.display = 'block';
}

toggleAccess.onclick = function () {
    register.style.display = 'none';
    access.style.display = 'block';
}

var actionCodeSettings = {
    url: 'http://127.0.0.1:5500/'
};

function showAuth() {
    hideItem(inputs);
    hideItem(userInfo);
    hideItem(todoList);
    hideItem(privateTodoList);
    hideItem(addTodo);
    hideItem(updateTodoBtns);
    showItem(authentication);
    email.value = '';
    password.value = '';
    hideItem(loading);
}

function showDefaultTodoList() {
    addUpdateTodoText.innerHTML = 'Adicionar tarefa:';
    hideItem(authentication);
    hideItem(updateTodoBtns);
    hideItem(uploaderFeedback);
    if (canEditTodoList) {
        showItem(inputs);
        showItem(addTodo);
        showItem(privateTodoList);
    }
    showItem(userInfo);
    showItem(todoList);
    todo.value = '';
    fileBtn.value = '';
    hideItem(loading);
}

var dbRef = firebase.database().ref();
var dbRefPublic = dbRef.child('publicTodoList');
var dbRefPrivate = dbRef.child('privateTodoList');

function getRefDb(checked, isPrivate, todoKey) {
    if (todoKey) {
        if (isPrivate) {
            return dbRefPrivate.child(uid);
        } else {
            return dbRefPublic;
        }
    } else {
        if (isPrivate || checked) {
            return dbRefPrivate.child(uid);
        } else {
            return dbRefPublic;
        }
    }
}