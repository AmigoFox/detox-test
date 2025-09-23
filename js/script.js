const modal = document.getElementById('modal');
const openBtns = document.querySelectorAll('.open-modal');
const closeBtn = document.querySelector('.close');

openBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    modal.style.display = 'flex';
  });
});

closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

window.addEventListener('click', function(e) {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
