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
    
    // --- LÓGICA DE CONFIRMACIÓN RSVP (Sin cambios) ---
    const rsvpContent = document.getElementById('rsvp-content');
    if (rsvpContent) {
        const rsvpDeadline = new Date('2025-07-31T23:59:59');
        if (new Date() > rsvpDeadline) {
            rsvpContent.innerHTML = `<div class="rsvp-expired-message"><p>El tiempo para confirmar ha terminado.</p><p>Si requieres información, comunícate al 0999 999 999.</p></div>`;
        } else {
            rsvpContent.innerHTML = `<p>Es un placer disfrutar de tu compañía.</p> <p>Ten la bondad de confirmar tu asistencia antes del 31 de Julio de 2025.</p> <button id="openRsvpModal" class="button">Confirmar Asistencia</button>`;
            document.getElementById('openRsvpModal').addEventListener('click', () => openModal('rsvpModal'));
        }
    }
    
    // --- LÓGICA DE VENTANAS EMERGENTES (MODALS) (Sin cambios) ---
    const modals = { rsvpModal: document.getElementById('rsvpModal'), giftsModal: document.getElementById('giftsModal') };
    const openGiftsBtn = document.getElementById('openGiftsModal');
    if(openGiftsBtn) openGiftsBtn.addEventListener('click', () => openModal('giftsModal'));
    
    function openModal(modalId) { if (modals[modalId]) modals[modalId].style.display = 'block'; }
    function closeModal() { for (let id in modals) { if (modals[id]) modals[id].style.display = 'none'; } }
    
    document.querySelectorAll('.close-button').forEach(btn => btn.addEventListener('click', closeModal));
    window.addEventListener('click', (event) => { if (event.target.classList.contains('modal')) closeModal(); });

    // --- LÓGICA DEL FORMULARIO DE FORMSPREE (Sin cambios) ---
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const form = event.target, data = new FormData(form);
            const response = await fetch(form.action, { method: form.method, body: data, headers: { 'Accept': 'application/json' } });
            if (response.ok) {
                document.getElementById('rsvpFormContainer').style.display = 'none';
                document.getElementById('thankYouMessage').style.display = 'block';
            } else {
                alert("Hubo un error al enviar tu confirmación. Por favor, intenta de nuevo.");
            }
        });
    }

    // --- NUEVO: NAVEGACIÓN ACTIVA AL BAJAR (SCROLL) ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

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
});