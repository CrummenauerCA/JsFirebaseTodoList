

function fillTodoList(dataSnapshot, key) {
  numTodos.innerHTML = dataSnapshot.numChildren() + ' tarefas:';
  ul.innerHTML = ''
  dataSnapshot.forEach(function (item) {
    var value = item.val()
    var li = document.createElement('li')
    var imgLi = document.createElement('img')
    imgLi.src = value.imgUrl
    imgLi.setAttribute('class', 'imgTodo')
    li.appendChild(imgLi)

    var pLi = document.createElement('span')
    pLi.appendChild(document.createTextNode(value.todo))
    pLi.id = item.key
    pLi.setAttribute('class', 'todoItemList')
    li.appendChild(pLi)


    var liRemoveBtn = document.createElement('button')
    liRemoveBtn.appendChild(document.createTextNode('Excluir'))
    liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + item.key + '\")')
    liRemoveBtn.setAttribute('class', 'todoBtn danger')
    li.appendChild(liRemoveBtn)
    /*
    <img class="imgTodo" src="../img/defaultTodo.png" height="16px">
    <span>Tarefa de exemplo</span>
    <button class="todoBtn danger">Excluir</button>
    <button class="todoBtn alternative">Editar</button>
    */
    var liUpdateBtn = document.createElement('button')
    liUpdateBtn.appendChild(document.createTextNode('Editar'))
    liUpdateBtn.setAttribute('onclick', 'updateTodo(\"' + item.key + '\")')
    liUpdateBtn.setAttribute('title', 'Editar')
    liUpdateBtn.setAttribute('class', 'todoBtn alternative')
    li.appendChild(liUpdateBtn)

    ul.appendChild(li)
  })
}

function updateTodo(key) {
  hideItem(addTodo)
  hideItem(privateCheckBox)
  showItem(updateTodoBtns)
  var itemSelected = document.getElementById(key)
  var isPrivate = (itemSelected.parentElement.id == 'true')
  todo.value = itemSelected.innerHTML
  addUpdateTodoText.innerHTML = '<strong>Editar a tarefa ' + (isPrivate ? 'privada' : 'pública') + ': ' + itemSelected.innerHTML + '</strong>'
  updateTodoBtn.onclick = function () {
    addOrUpdateTodo(key, isPrivate)
  }
}

todoForm.onsubmit = function (event) {
  event.preventDefault()
  addOrUpdateTodo()
}

function addOrUpdateTodo(key) {
  if (todo.value != '') {
    var file = fileBtn.files[0]
    if (file != null) {
      if (file.type.includes('image')) {
        hideItem(updateTodoBtns)
        hideItem(addTodo)
        var imgPath = 'todoFiles/' + firebase.database().ref().push().key + '-' + file.name
        var storageRef = firebase.storage().ref(imgPath)
        var uploadTask = storageRef.put(file)
        showItem(uploaderFeedback)

        var playPauseuploadTask = true
        playPauseBtn.innerHTML = 'Pausar'

        playPauseBtn.onclick = function () {
          playPauseuploadTask = !playPauseuploadTask
          if (playPauseuploadTask) {
            playPauseBtn.innerHTML = 'Pausar'
            uploadTask.resume()
          } else {
            playPauseBtn.innerHTML = 'Continuar'
            uploadTask.pause()
          }
        }

        calcelBtn.onclick = function () {
          uploadTask.cancel()
          showDefaultTodoList()
          showError(null, 'Upload cancelado!')
        }

        uploadTask.on('state_changed', function (snapshot) {
          progress.value = snapshot.bytesTransferred / snapshot.totalBytes * 100
        }, function (error) {
          showError(error, 'Upload cancelado ou erro no upload do arquivo...')
        }, function () {
          hideItem(uploaderFeedback)
          showItem(loading)
          storageRef.getDownloadURL().then(function (downloadURL) {
            var data = {
              todo: todo.value,
              imgPath: imgPath,
              imgUrl: downloadURL
            }
            if (key) {
              database.ref('todoList/' + uid).child(key).once('value').then(function (snapshot) {
                var storageRef = firebase.storage().ref(snapshot.val().imgPath)
                if (storageRef.location.path != 'img/defaultTodo.png') {
                  storageRef.delete().catch(function (error) {
                    showError(error, 'Houve um erro ao remover a imagem antiga da tarefa! Nenhuma ação é necessária')
                  })
                }
                db.child(key).update(data)
              })
            } else {
              db.push(data)
            }
            showDefaultTodoList()
          })
        })
      } else {
        alert('É preciso que o arquivo selecionado seja uma imagem!')
      }
    } else {
      if (key) {
        db.child(key).update({ todo: todo.value })
      } else {
        var data = {
          todo: todo.value,
          imgPath: 'img/defaultTodo.png',
          imgUrl: 'img/defaultTodo.png'
        }
        database.ref('todoList/' + uid).push(data)
      }
      // showDefaultTodoList()
    }
  } else {
    alert('O formulário não pode estar vazio para criar a tarefa!')
  }
}

function removeTodo(key) {
  var itemSelected = document.getElementById(key)
  var isPrivate = (itemSelected.parentElement.id == 'true')
  var confirmation = confirm('Realmente deseja remover a tarefa ' + (isPrivate ? 'privada' : 'pública') + ' (' + itemSelected.innerHTML + ')?')
  var db = getRefDb(isPrivate)
  if (confirmation) {
    db.child(key).once('value').then(function (snapshot) {
      var storageRef = firebase.storage().ref(snapshot.val().imgPath)
      if (storageRef.location.path != 'img/defaultTodo.png') {
        storageRef.delete().catch(function (error) {
          showError(error, 'Houve um erro ao remover o arquivo da tarefa!')
        })
      }
      db.child(key).remove().catch(function (error) {
        showError(error, 'Houve um erro ao remover a tarefa!')
      })
    })
  }
  showDefaultTodoList()
}

cancelUpdateTodoBtn.onclick = function () {
  showDefaultTodoList()
}