const personnelCards = document.querySelectorAll('.personnel-card');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
let currentIndex = 0;

function updateSlider() {
  personnelCards.forEach((card, index) => {
    card.classList.toggle('active', index === currentIndex);
  });
}

prevBtn?.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + personnelCards.length) % personnelCards.length;
  updateSlider();
});

nextBtn?.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % personnelCards.length;
  updateSlider();
});

setInterval(() => {
  currentIndex = (currentIndex + 1) % personnelCards.length;
  updateSlider();
}, 5000);

personnelCards.forEach((card, index) => {
  card.addEventListener('click', () => {
    currentIndex = index;
    updateSlider();
  });
});

const modal = document.getElementById('modal');
const openBtns = document.querySelectorAll('.open-modal');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('callbackForm');
const responseMessage = document.getElementById('responseMessage');

openBtns.forEach(btn => btn.addEventListener('click', () => modal.style.display = 'flex'));

closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch('../php/process.php', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Сервер вернул ошибку: ' + response.status);

      const result = await response.json();

      if (result.success) {
        form.style.display = 'none';
        responseMessage.className = 'response success';
        responseMessage.textContent = result.message || '✅ Заявка успешно отправлена!';
      } else {
        responseMessage.className = 'response error';
        responseMessage.textContent = result.error || result.message || '❌ Ошибка отправки формы.';
      }
    } catch (error) {
      console.error('Ошибка:', error);
      responseMessage.className = 'response error';
      responseMessage.textContent = '⚠ Ошибка сети. Пожалуйста, попробуйте позже.';
    }
  });
}
