const modal = document.getElementById('modal');
const openBtns = document.querySelectorAll('.open-modal');
const closeBtn = document.querySelector('.close');

// Открыть модалку
openBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    modal.style.display = 'flex';
  });
});

// Закрыть модалку
closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

// Закрытие по клику вне окна
window.addEventListener('click', function(e) {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
