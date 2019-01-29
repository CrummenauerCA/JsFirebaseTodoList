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

function afterUpdateTodoList() {
    todo.value = '';
    fileBtn.value = '';
    addUpdateTodoText.innerHTML = 'Adicionar tarefa:';
    hideItem(updateTodoBtns);
    showItem(addTodo);
    hideItem(loading);
    hideItem(uploaderFeedback);
}