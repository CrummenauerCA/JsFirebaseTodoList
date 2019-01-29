dbObject.child('privateTodoList').child(uid).orderByChild('todo').on('value', function (dataSnapshot) {
    fillTodoList(dataSnapshot, 'privadas');
});

dbObject.child('publicTodoList').orderByChild('todo').on('value', function (dataSnapshot) {
    fillTodoList(dataSnapshot, 'públicas');
});

function fillTodoList(dataSnapshot, list) {
    pNumTodos = document.createElement('p');
    pNumTodos.innerHTML = '<b>' + dataSnapshot.numChildren() + ' tarefas ' + list + ':</b>';

    var ul = document.createElement('ul');
    dataSnapshot.forEach(function (item) {
        var value = item.val();
        var li = document.createElement('li');
        var imgLi = document.createElement('img');
        imgLi.height = 28;
        imgLi.width = 28;
        imgLi.src = value.imgUrl;
        li.appendChild(imgLi);

        var pLi = document.createElement('p');
        pLi.appendChild(document.createTextNode(value.todo));
        pLi.id = item.key;
        pLi.setAttribute('class', 'todoItemList');
        li.appendChild(pLi);

        if (canEditTodoList) {
            var liRemoveBtn = document.createElement('button');
            liRemoveBtn.appendChild(document.createTextNode('✖'));
            liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + item.key + '\")');
            liRemoveBtn.setAttribute('title', 'Remover esta tarefa');
            liRemoveBtn.setAttribute('class', 'danger');
            li.appendChild(liRemoveBtn);

            var liUpdateBtn = document.createElement('button');
            liUpdateBtn.appendChild(document.createTextNode('✎'));
            liUpdateBtn.setAttribute('onclick', 'updateTodo(\"' + item.key + '\")');
            liUpdateBtn.setAttribute('title', 'Editar esta tarefa');
            liUpdateBtn.setAttribute('class', 'alternative');
            li.appendChild(liUpdateBtn);
        }
        ul.appendChild(li);
    });
    if (list == 'privadas') {
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

function addOrUpdateTodo(todoKey) {
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
                        if (private.checked) {
                            if (todoKey) {
                                dbObject.child('privateTodoList').child(uid).child(todoKey).update(data);
                            } else {
                                dbObject.child('privateTodoList').child(uid).push(data);
                            }
                        } else {
                            if (todoKey) {
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
                dbObject.child('publicTodoList').child(todoKey).update(data);
                showDefaultTodoList();
            } else {
                alert('É preciso selecionar uma imagem para a tarefa!');
            }
        }
    } else {
        alert('O formulário não pode estar vazio para criar a tarefa!');
    }
}

function updateTodo(todoKey) {
    hideItem(addTodo);
    showItem(updateTodoBtns);
    var liSelected = document.getElementById(todoKey);
    todo.value = liSelected.innerHTML;
    addUpdateTodoText.innerHTML = '<strong>Atualizar a tarefa: ' + liSelected.innerHTML + '</strong>';
    updateTodoBtn.onclick = function () {
        addOrUpdateTodo(todoKey);
    };
}

function removeTodo(key) {
    var liSelected = document.getElementById(key);
    var confirmation = confirm('Realmente deseja remover a tarefa (' + liSelected.innerHTML + ')?');
    if (confirmation) {
        dbObject.child(key).once('value').then(function (snapshot) {
            var storageRef = firebase.storage().ref(snapshot.val().imgPath);
            storageRef.delete().catch(function (error) {
                showError(error, 'Houve um erro ao remover o arquivo da tarefa!');
            });
            dbObject.child(key).remove().catch(function (error) {
                showError(error, 'Houve um erro ao remover a tarefa!');
            });
        });
    }
}

cancelUpdateTodoBtn.onclick = function () {
    showDefaultTodoList();
};