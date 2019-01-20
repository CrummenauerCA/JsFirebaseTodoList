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