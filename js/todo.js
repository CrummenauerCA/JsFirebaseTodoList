dbObject.child('publicTodoList').orderByChild('todo').on('value', function (dataSnapshot) {
    fillTodoList(dataSnapshot, false);
});

dbObject.child('privateTodoList').on('value', function () {
    dbObject.child('privateTodoList').child(uid).orderByChild('todo').once('value', function (dataSnapshot) {
        fillTodoList(dataSnapshot, true);
    });
});

function fillTodoList(dataSnapshot, isPrivate) {
    pNumTodos = document.createElement('p');

    pNumTodos.innerHTML = '<b>' + dataSnapshot.numChildren() + ' tarefas ' + (isPrivate ? 'privadas' : 'públicas') + ':</b>';

    var ul = document.createElement('ul');
    dataSnapshot.forEach(function (item) {
        var value = item.val();
        var li = document.createElement('li');
        var imgLi = document.createElement('img');
        imgLi.height = 24;
        imgLi.width = 24;
        imgLi.src = value.imgUrl;
        li.appendChild(imgLi);

        var pLi = document.createElement('p');
        pLi.appendChild(document.createTextNode(value.todo));
        pLi.id = item.key;
        pLi.setAttribute('class', 'todoItemList');
        li.id = isPrivate;
        li.appendChild(pLi);

        if (canEditTodoList) {
            var liRemoveBtn = document.createElement('button');
            liRemoveBtn.appendChild(document.createTextNode('✖'));
            liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + item.key + '\")');
            liRemoveBtn.setAttribute('title', 'Remover esta tarefa');
            liRemoveBtn.setAttribute('class', 'danger lbtn');
            li.appendChild(liRemoveBtn);

            var liUpdateBtn = document.createElement('button');
            liUpdateBtn.appendChild(document.createTextNode('✎'));
            liUpdateBtn.setAttribute('onclick', 'updateTodo(\"' + item.key + '\")');
            liUpdateBtn.setAttribute('title', 'Editar esta tarefa');
            liUpdateBtn.setAttribute('class', 'alternative lbtn');
            li.appendChild(liUpdateBtn);
        }
        ul.appendChild(li);
    });
    if (isPrivate) {
        privateTodoList.innerHTML = '';
        privateTodoList.appendChild(pNumTodos);
        privateTodoList.appendChild(ul);
    } else {
        todoList.innerHTML = '';
        todoList.appendChild(pNumTodos);
        todoList.appendChild(ul);
    }
}

addTodoBtn.onclick = function () {
    addOrUpdateTodo();
};

function updateTodo(todoKey) {
    hideItem(addTodo);
    // hideItem(private);
    showItem(updateTodoBtns);
    var itemSelected = document.getElementById(todoKey);

    var isPrivate = itemSelected.parentElement.id;

    todo.value = itemSelected.innerHTML;
    addUpdateTodoText.innerHTML = '<strong>Atualizar a tarefa ' + (isPrivate ? 'privada' : 'pública') + ': ' + itemSelected.innerHTML + '</strong>';
    updateTodoBtn.onclick = function () {
        addOrUpdateTodo(todoKey, isPrivate);
    };
}

function addOrUpdateTodo(todoKey, isPrivate) {
    if (todo.value != '') {
        var file = fileBtn.files[0];
        if (file != null) {
            if (file.type.includes('image')) {
                hideItem(updateTodoBtns);
                hideItem(addTodo);
                var key = firebase.database().ref().push().key;
                var imgPath = 'files/' + key + '_' + file.name;
                var storageRef = firebase.storage().ref(imgPath);
                var uploadTask = storageRef.put(file);
                showItem(uploaderFeedback);

                var playPauseuploadTask = true;
                playPauseBtn.innerHTML = 'Pausar';

                playPauseBtn.onclick = function () {
                    playPauseuploadTask = !playPauseuploadTask;
                    if (playPauseuploadTask) {
                        playPauseBtn.innerHTML = 'Pausar';
                        uploadTask.resume();
                    } else {
                        playPauseBtn.innerHTML = 'Continuar';
                        uploadTask.pause();
                    }
                };

                calcelBtn.onclick = function () {
                    uploadTask.cancel();
                    showDefaultTodoList();
                    showError(null, 'Upload cancelado!');
                };

                uploadTask.on('state_changed', function (snapshot) {
                    progress.value = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                }, function (error) {
                    showError(error, 'Upload cancelado ou erro no upload do arquivo...');
                }, function () {
                    hideItem(uploaderFeedback);
                    showItem(loading);
                    storageRef.getDownloadURL().then(function (downloadURL) {
                        var data = {
                            todo: todo.value,
                            imgPath: imgPath,
                            imgUrl: downloadURL
                        };
                        if (private.checked || isPrivate == 'true') { // Criar tarefas privadas e públicas
                            if (todoKey) {
                                dbObject.child('privateTodoList').child(uid).child(todoKey).update(data);
                            } else {
                                dbObject.child('privateTodoList').child(uid).push(data);
                            }
                        } else {
                            if (todoKey) { // Atualizar completamente tarefas privadas e públicas
                                dbObject.child('publicTodoList').child(todoKey).update(data);
                            } else {
                                dbObject.child('publicTodoList').push(data);
                            }
                        }
                        showDefaultTodoList();
                    });
                });
            } else {
                alert('É preciso que o arquivo selecionado seja uma imagem!');
            }
        } else {
            if (todoKey) {
                var data = {
                    todo: todo.value
                }
                console.log('isPrivate: ' + isPrivate);
                if (isPrivate == 'true') { // Atualizar somente descrição da tarefa privada (todo);
                    dbObject.child('privateTodoList').child(uid).child(todoKey).update(data);
                } else { // Atualizar somente descrição da tarefa pública (todo);
                    dbObject.child('publicTodoList').child(todoKey).update(data);
                }
            } else {
                var data = {
                    todo: todo.value,
                    imgPath: 'img/defaultTodo.png',
                    imgUrl: 'img/defaultTodo.png'
                }
                if (private.checked || isPrivate == 'true') { // Criar tarefas privadas e públicas
                    dbObject.child('privateTodoList').child(uid).push(data);
                } else {
                    dbObject.child('publicTodoList').push(data);
                }
            }
            showDefaultTodoList();
        }
    } else {
        alert('O formulário não pode estar vazio para criar a tarefa!');
    }
}

function removeTodo(key) {
    var itemSelected = document.getElementById(key);
    var isPrivate = itemSelected.parentElement.id;
    var confirmation = confirm('Realmente deseja remover a tarefa ' + (isPrivate ? 'privada' : 'pública') + ' (' + itemSelected.innerHTML + ')?');
    if (confirmation) {
        if (isPrivate == 'true') {
            dbObject.child('privateTodoList').child(uid).child(key).once('value').then(function (snapshot) {
                var storageRef = firebase.storage().ref(snapshot.val().imgPath);
                console.log(storageRef);
                if (storageRef.location.path != 'img/defaultTodo.png') {
                    storageRef.delete().catch(function (error) {
                        showError(error, 'Houve um erro ao remover o arquivo da tarefa!');
                    });
                }
                dbObject.child('privateTodoList').child(uid).child(key).remove().catch(function (error) {
                    showError(error, 'Houve um erro ao remover a tarefa!');
                });
            });
        } else {
            dbObject.child('publicTodoList').child(key).once('value').then(function (snapshot) {
                var storageRef = firebase.storage().ref(snapshot.val().imgPath);
                console.log(storageRef);
                if (storageRef.location.path != 'img/defaultTodo.png') {
                    storageRef.delete().catch(function (error) {
                        showError(error, 'Houve um erro ao remover o arquivo da tarefa!');
                    });
                }
                dbObject.child('publicTodoList').child(key).remove().catch(function (error) {
                    showError(error, 'Houve um erro ao remover a tarefa!');
                });
            });
        }
    }
}

cancelUpdateTodoBtn.onclick = function () {
    showDefaultTodoList();
};