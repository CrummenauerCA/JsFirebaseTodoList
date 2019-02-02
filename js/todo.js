dbRefPublic.orderByChild('todo').on('value', function (dataSnapshot) {
    fillTodoList(dataSnapshot, false);
});

dbRefPrivate.on('value', function () {
    dbRefPrivate.child(uid).orderByChild('todo').once('value', function (dataSnapshot) {
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
    hideItem(privateCheckBox);
    showItem(updateTodoBtns);
    var itemSelected = document.getElementById(todoKey);
    var isPrivate = (itemSelected.parentElement.id == 'true');
    todo.value = itemSelected.innerHTML;
    addUpdateTodoText.innerHTML = '<strong>Atualizar a tarefa ' + (isPrivate ? 'privada' : 'pública') + ': ' + itemSelected.innerHTML + '</strong>';
    updateTodoBtn.onclick = function () {
        addOrUpdateTodo(todoKey, isPrivate);
    };
}

function addOrUpdateTodo(todoKey, isPrivate) {
    if (todo.value != '') {
        var file = fileBtn.files[0];
        var db = getRefDb(private.checked, isPrivate, todoKey);
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

                        if (todoKey) {
                            db.child(todoKey).update(data);
                        } else {
                            db.push(data);
                        }
                        showDefaultTodoList();
                    });
                });
            } else {
                alert('É preciso que o arquivo selecionado seja uma imagem!');
            }
        } else {
            if (todoKey) {
                db.child(todoKey).update({ todo: todo.value });
            } else {
                var data = {
                    todo: todo.value,
                    imgPath: 'img/defaultTodo.png',
                    imgUrl: 'img/defaultTodo.png'
                }
                db.push(data);
            }
            showDefaultTodoList();
        }
    } else {
        alert('O formulário não pode estar vazio para criar a tarefa!');
    }
}

function removeTodo(key) {
    var itemSelected = document.getElementById(key);
    console.log();
    var isPrivate = (itemSelected.parentElement.id == 'true');
    var confirmation = confirm('Realmente deseja remover a tarefa ' + (isPrivate ? 'privada' : 'pública') + ' (' + itemSelected.innerHTML + ')?');

    var db = getRefDb(isPrivate);

    if (confirmation) {
        db.child(key).once('value').then(function (snapshot) {
            var storageRef = firebase.storage().ref(snapshot.val().imgPath);
            if (storageRef.location.path != 'img/defaultTodo.png') {
                storageRef.delete().catch(function (error) {
                    showError(error, 'Houve um erro ao remover o arquivo da tarefa!');
                });
            }
            db.child(key).remove().catch(function (error) {
                showError(error, 'Houve um erro ao remover a tarefa!');
            });
        });
    }
}

cancelUpdateTodoBtn.onclick = function () {
    showDefaultTodoList();
};