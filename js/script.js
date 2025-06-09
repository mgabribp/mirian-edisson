document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DEL CONTADOR REGRESIVO (Sin cambios) ---
    const weddingDate = new Date('2025-08-31T11:00:00').getTime();
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const timer = setInterval(function() {
            const now = new Date().getTime();
            const distance = weddingDate - now;
            if (distance < 0) {
                clearInterval(timer);
                countdownElement.innerHTML = "<div style='grid-column: 1 / -1; font-size: 1.5em;'>¡Llegó el gran día!</div>";
                return;
            }
            const target = new Date('2025-08-31T11:00:00');
            let current = new Date();
            let months = (target.getFullYear() - current.getFullYear()) * 12 - current.getMonth() + target.getMonth();
            let days = target.getDate() - current.getDate();
            if (days < 0) {
                months--;
                days += new Date(current.getFullYear(), current.getMonth(), 0).getDate();
            }
            if (target.getTime() < current.getTime()) months = days = 0;
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('months').innerText = months;
            document.getElementById('days').innerText = days;
            document.getElementById('hours').innerText = hours;
            document.getElementById('minutes').innerText = minutes;
            document.getElementById('seconds').innerText = seconds;
        }, 1000);
    }
    
    // --- LÓGICA DE CONFIRMACIÓN RSVP (Ya tienes esta parte) ---
    const rsvpContent = document.getElementById('rsvp-content');
    if (rsvpContent) {
        const rsvpDeadline = new Date('2025-07-31T23:59:59');
        if (new Date() > rsvpDeadline) {
            rsvpContent.innerHTML = `<div class="rsvp-expired-message"><p>El tiempo para confirmar ha terminado.</p><p>Si requieres información, comunícate al 0999 999 999.</p></div>`;
        } else {
            rsvpContent.innerHTML = `<p>Es un placer disfrutar de tu compañía.</p> <p>Ten la bondad de confirmar tu asistencia hasta el 31 de Julio de 2025.</p> <button id="openRsvpModal" class="button">Confirmar Asistencia</button>`;
            // Asegúrate de que la función openModal esté definida
            document.getElementById('openRsvpModal').addEventListener('click', () => openModal('rsvpModal'));
        }
    }


    // --- LÓGICA PARA EL ENVÍO DEL FORMULARIO A GOOGLE APPS SCRIPT Y EL MENSAJE DE AGRADECIMIENTO ---

    // Obtener referencias a los elementos del DOM
    const form = document.getElementById('rsvpForm');
    const formContainer = document.getElementById('rsvpFormContainer');
    const thankYouMessage = document.getElementById('thankYouMessage');

    // Añadir un "event listener" para el evento 'submit' del formulario
    if (form) { // Asegúrate de que el formulario existe antes de añadir el listener
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Detiene el envío predeterminado del formulario que recargaría la página
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const formData = new FormData(form); // Crea un objeto FormData con los datos del formulario
            
            try {
                // Envía los datos del formulario a la URL de Google Apps Script
                const response = await fetch(form.action, {
                    method: form.method, // Método POST
                    body: formData,     // Datos del formulario
                    // No es necesario 'Accept': 'application/json' para Apps Script si la respuesta es solo un texto
                });

                if (response.ok) { // Si la respuesta de la solicitud es exitosa (código 200 OK)
                    // Oculta el contenedor del formulario y muestra el mensaje de agradecimiento
                    formContainer.style.display = 'none';
                    thankYouMessage.style.display = 'block';
                    form.reset(); // Limpia el formulario después de un envío exitoso
                } else {
                    // Si hubo un error en la respuesta del servidor o de Apps Script
                    alert('Hubo un error al enviar tu confirmación. Por favor, inténtalo de nuevo.');
                    console.error('Error al enviar el formulario:', response.status, await response.text());
                }
            } catch (error) {
                // Si hubo un error de red (por ejemplo, el usuario no tiene conexión)
                console.error('Error de red:', error);
                alert('Hubo un problema de conexión. Por favor, verifica tu internet e inténtalo de nuevo.');
            }
        });
    }


    // --- Lógica para el botón de cierre del modal y clic fuera del modal ---
    // (Ahora se consolida aquí y se eliminan duplicados para rsvpModal)

    const closeButtons = document.querySelectorAll('.close-button'); // Selecciona todos los botones de cierre
    const rsvpModal = document.getElementById('rsvpModal');
    const giftsModal = document.getElementById('giftsModal'); // También el modal de regalos

    // Función para cerrar un modal específico
    function closeModal(modalElement) {
        if (modalElement) {
            modalElement.style.display = 'none';
            // Si es el modal de RSVP, restablece su estado
            if (modalElement.id === 'rsvpModal') {
                formContainer.style.display = 'block';
                thankYouMessage.style.display = 'none';
                form.reset();
            }
        }
    }

    // Event listeners para todos los botones de cierre
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const parentModal = event.target.closest('.modal'); // Encuentra el modal padre
            closeModal(parentModal);
        });
    });

    // Event listener para cerrar modales al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === rsvpModal) {
            closeModal(rsvpModal);
        }
        if (event.target === giftsModal) {
            closeModal(giftsModal);
        }
    });

    // --- LÓGICA DE APERTURA DE VENTANAS EMERGENTES (MODALS) ---
    // (Consolidada para usar la misma lógica de openModal)
    
    // Función para abrir un modal
    function openModal(modalId) { 
        const modalToOpen = document.getElementById(modalId);
        if (modalToOpen) {
            modalToOpen.style.display = 'block'; // O 'flex' o el display que uses para mostrar el modal
        }
    }

    // Botón para abrir el modal de regalos
    const openGiftsBtn = document.getElementById('openGiftsModal');
    if(openGiftsBtn) openGiftsBtn.addEventListener('click', () => openModal('giftsModal'));


    // --- NUEVO: NAVEGACIÓN ACTIVA AL BAJAR (SCROLL) ---
    // (Sin cambios, pero si no tienes .nav-menu en tu HTML, esto no hará nada)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a'); // Asegúrate de que este selector sea correcto si tienes un menú de navegación

    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const navLink = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }, observerOptions);
    sections.forEach(section => sectionObserver.observe(section));

    // --- NUEVO: ANIMACIÓN DE ENTRADA AL BAJAR (SCROLL) ---
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
}); // Fin de DOMContentLoaded