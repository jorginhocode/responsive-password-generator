document.addEventListener("DOMContentLoaded", function () {
  // === TEMA ===
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // CARGAR TEMA GUARDADO
  function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      body.classList.add('light-theme');
      updateThemeIcon(true);
    }
  }

  // ACTUALIZAR ICONO
  function updateThemeIcon(isLight) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = isLight ? 'ri-sun-line' : 'ri-moon-line';
    }
  }

  // CAMBIAR TEMA
  function toggleTheme() {
    const isLight = body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
  }

  // INICIALIZAR TEMA
  if (themeToggle) {
    loadTheme();
    themeToggle.addEventListener('click', toggleTheme);
  } else {
    console.error('Botón themeToggle no encontrado');
  }

  // === GENERADOR DE CONTRASEÑAS ===
  const slider = document.getElementById('lengthSlider');
  const defaultLength = parseInt(slider.value);
  document.getElementById('sliderValue').textContent = defaultLength;
  generateRandomPassword();

  // ACTUALIZAR CONTRASEÑA CON EL SLIDER
  slider.addEventListener('input', function () {
    const sliderValue = slider.value;
    document.getElementById('sliderValue').textContent = sliderValue;
    generateRandomPassword();
  });

  // GENERAR NUEVA CONTRASEÑA AL ENVIAR FORMULARIO
  document.getElementById('passwordForm').addEventListener('submit', function (event) {
    event.preventDefault();
    generateRandomPassword();
  });

  // CAMBIOS EN CHECKBOXES
  document.querySelectorAll('input[type=checkbox]').forEach(function (checkbox) {
    checkbox.addEventListener('change', generateRandomPassword);
  });

  // COPIAR CONTRASEÑA
  document.getElementById('copyButton').addEventListener('click', function (event) {
    event.preventDefault(); // EVITAR REGENERACIÓN DE CONTRASEÑA
    const generatedPassword = document.getElementById('generatedPassword').textContent.trim();
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword).then(() => {
        showNotification('Password copied successfully!');
      }).catch(err => {
        console.error('Error al copiar:', err);
        // FALLBACK PARA NAVEGADORES ANTIGUOS
        const tempInput = document.createElement('input');
        tempInput.value = generatedPassword;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showNotification('Password copied!');
      });
    }
  });
});

// FUNCIÓN PARA GENERAR CONTRASEÑA ALEATORIA
function generateRandomPassword() {
  const length = parseInt(document.getElementById('lengthSlider').value);
  const upper = document.getElementById('upper').checked;
  const lower = document.getElementById('lower').checked;
  const numbers = document.getElementById('numbers').checked;
  const symbols = document.getElementById('symbols').checked;

  let allowedChars = '';
  if (upper) allowedChars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lower) allowedChars += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) allowedChars += '0123456789';
  if (symbols) allowedChars += '!@#$%^&*()_+~-={}[]|:;<>,.?/';

  if (allowedChars === '') {
    allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
  }

  document.getElementById('generatedPassword').textContent = password || 'No password generated';
}

// MOSTRAR NOTIFICACIÓN
function showNotification(message) {
  const notification = document.getElementById('notification');
  if (notification) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 1500);
  }
}
