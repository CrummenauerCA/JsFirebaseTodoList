const dbObject = firebase.database().ref().child('todoList');

var imgUpload = document.getElementById('imgUpload');

addTodoBtn.onclick = function () {
    if (todo.value != '') {
        let uploaderFeedback = document.getElementById('uploaderFeedback');
        let fileBtn = document.getElementById('fileBtn');
        var file = fileBtn.files[0];
        if (file == null) {
            alert('É preciso selecionar uma imagem para a tarefa!');
            return;
        }
        loading.style.display = 'block';
        var storageRef = firebase.storage().ref('files/' + new Date().getTime() + '_' + file.name);
        var uploadTask = storageRef.put(file);
        uploadTask.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploaderFeedback.style.display = 'inline';
            uploaderFeedback.value = progress;
        }, function (error) {
            alert('Erro no upload do arquivo...');
            console.log(error);
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL()
                .then(function (downloadURL) {
                    var data = {
                        todo: todo.value,
                        priority: priority.value,
                        imgUrl: downloadURL,
                        imgPath: storageRef.fullPath
                    }
                    uploaderFeedback.style.display = 'none';
                    return dbObject.push(data);
                });
        });
    } else {
        alert('O formulário não pode estar vazio para criar a tarefa!');
    }
}

dbObject.orderByChild('todo').on('value', function (dataSnapshot) {
    fillTodoList(dataSnapshot);
});

function fillTodoList(dataSnapshot) {
    loading.style.display = 'none';
    todoList.innerHTML = '';
    dataSnapshot.forEach(function (item) {
        var value = item.val();
        var li = document.createElement('li');
        var imgLi = document.createElement('img');
        imgLi.height = 26;
        imgLi.width = 26;
        imgLi.src = value.imgUrl;
        li.appendChild(imgLi);

        var pLi = document.createElement('p');
        pLi.appendChild(document.createTextNode(value.todo + ' : ' + value.priority + ' '));
        pLi.id = item.key;
        pLi.setAttribute('class', 'todoItemList');
        li.appendChild(pLi);

        if (canEditTodoList) {
            var liRemoveBtn = document.createElement('button');
            liRemoveBtn.appendChild(document.createTextNode('✖'));
            liRemoveBtn.setAttribute('onclick', `removeTodo(\"${item.key}\")`);
            liRemoveBtn.setAttribute('title', 'Remover esta tarefa');
            liRemoveBtn.setAttribute('class', 'removeBtn');
            li.appendChild(liRemoveBtn);

            var liUpdateBtn = document.createElement('button');
            liUpdateBtn.appendChild(document.createTextNode('✎'));
            liUpdateBtn.setAttribute('onclick', `updateTodo(\"${item.key}\")`);
            liUpdateBtn.setAttribute('title', 'Atualizar usando os dados do formulário');
            liUpdateBtn.setAttribute('class', 'updateBtn');
            li.appendChild(liUpdateBtn);
        }
        todoList.appendChild(li);
    });
    loading.style.display = 'none';
}

function removeTodo(key) {
    var liSelected = document.getElementById(key);
    var confirmation = confirm('Realmente deseja remover (' + liSelected.innerHTML + ')');
    if (confirmation == true) {
        dbObjectRemove = dbObject.child(key);
        dbObjectRemove.once('value').then(function (snapshot) {
            var storageRef = firebase.storage().ref(snapshot.val().imgPath);
            storageRef.delete().catch(function (error) {
                showError(error, 'Houve um erro ao remover o arquivo!');
            });
        });
        dbObject.child(key).remove().catch(function (error) {
            showError(error, 'Houve um erro ao remover a tarefa!');
        });;
    }
}

function updateTodo(key) {
    todo.value = '';
    userInfo.style.display = 'none';
    todoList.style.display = 'none';
    addTodoBtn.style.display = 'none';
    updateBtns.style.display = 'block';
    var liSelected = document.getElementById(key);
    addUpdateTodoText.innerHTML = 'Atualizar a tarefa: \"' + liSelected.innerHTML + '\"';

    updateTodoBtn.onclick = function () {
        if (todo.value != '') {
            var confirmation = confirm('Realmente deseja atualizar de (' + liSelected.innerHTML + ') para (' + todo.value + ' : ' + priority.value + ')');
            if (confirmation == true) {

                let uploaderFeedback = document.getElementById('uploaderFeedback');
                let fileBtn = document.getElementById('fileBtn');
                var file = fileBtn.files[0];
                var storageRef = firebase.storage().ref('files/' + file.name);
                var uploadTask = storageRef.put(file)
                uploadTask.on('state_changed', function (snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    uploaderFeedback.style.display = 'inline';
                    uploaderFeedback.value = progress;
                }, function (error) {
                    alert('Erro no upload do arquivo...');
                    console.log(error);
                }, function () {
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then(function (downloadURL) {
                            var data = {
                                todo: todo.value,
                                priority: priority.value,
                                imgUrl: downloadURL
                            }
                            dbObject.child(key).update(data);
                            uploaderFeedback.style.display = 'none';
                        });
                });
            }
        } else {
            alert('O formulário não pode estar vazio para atualizar a tarefa!');
        }

        addUpdateTodoText.innerHTML = 'Adicionar tarefa: ';
        loggedIn.style.display = 'block';
        updateBtns.style.display = 'none';
        addTodoBtn.style.display = 'inline';
        todo.value = '';
    }
}

cancelUpdateTodoBtn.onclick = function () {
    addUpdateTodoText.innerHTML = 'Adicionar tarefa: ';
    addTodoBtn.style.display = 'inline';
    loading.style.display = 'none';
    todo.value = '';
    userInfo.style.display = 'block';
    todoList.style.display = 'block';
    updateBtns.style.display = 'none';
}