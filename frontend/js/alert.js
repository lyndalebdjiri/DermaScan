
//custom alert handling
function showAlert(message) {
  document.getElementById('customAlertMessage').textContent = message;
  document.getElementById('customAlert').classList.add('show');
}

function closeAlert() {
  document.getElementById('customAlert').classList.remove('show');
}

window.closeAlert = closeAlert;
