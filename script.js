// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (!isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 70;
            const offsetTop = target.offsetTop - navbarHeight;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
        });
    });
});

// Statistics Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Quote Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value || 'No proporcionado';
            const tipoPropiedad = document.getElementById('tipoPropiedad').value;
            const numeroVentanas = document.getElementById('numeroVentanas').value;
            const mensaje = document.getElementById('mensaje').value || 'Ninguna';
            
            // Create email body
            const subject = encodeURIComponent('Solicitud de Presupuesto - Cristal Claro');
            const body = encodeURIComponent(
                'Nueva Solicitud de Presupuesto\n\n' +
                'DATOS DEL CLIENTE:\n' +
                'Nombre: ' + nombre + '\n' +
                'Email: ' + email + '\n' +
                'Teléfono: ' + telefono + '\n\n' +
                'INFORMACIÓN DEL SERVICIO:\n' +
                'Tipo de Propiedad: ' + tipoPropiedad + '\n' +
                'Número Aproximado de Ventanas: ' + numeroVentanas + '\n\n' +
                'INFORMACIÓN ADICIONAL:\n' + mensaje + '\n\n' +
                'NOTA: Puede adjuntar fotos o vídeos de sus ventanas en este email para un presupuesto más preciso.\n\n' +
                '---\n' +
                'Le respondo en breve con precio económico.'
            );
            
            // Create mailto link
            const mailtoLink = 'mailto:eslimjallow@gmail.com?subject=' + subject + '&body=' + body;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showFormSuccess();
            
            // Reset form after a delay
            setTimeout(function() {
                quoteForm.reset();
            }, 1000);
        });
    }
});

function showFormSuccess() {
    // Create success message if it doesn't exist
    let successMsg = document.querySelector('.form-success');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.textContent = '✓ ¡Formulario enviado! Su cliente de correo se abrirá para enviar la solicitud.';
        const form = document.getElementById('quoteForm');
        if (form) {
            form.insertBefore(successMsg, form.firstChild);
        }
    }
    
    successMsg.classList.add('show');
    
    // Scroll to success message
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide after 5 seconds
    setTimeout(function() {
        successMsg.classList.remove('show');
    }, 5000);
}

// Set minimum date for booking form on page load
document.addEventListener('DOMContentLoaded', function() {
    const fechaInput = document.getElementById('bookingFecha');
    if (fechaInput) {
        const today = new Date().toISOString().split('T')[0];
        fechaInput.setAttribute('min', today);
        
        // Add event listener to update time slots when date changes
        fechaInput.addEventListener('change', function() {
            updateTimeSlots();
        });
    }
});

// Function to generate time slots based on day of week
function getTimeSlots(dateString) {
    if (!dateString) return [];
    
    const date = new Date(dateString);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    let startHour, startMinute;
    
    // Monday (1) to Thursday (4): 9:30 AM to 7:00 PM
    // Friday (5) to Sunday (0): 7:00 AM to 7:00 PM
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
        // Monday to Thursday: 9:30 AM to 7:00 PM
        startHour = 9;
        startMinute = 30;
    } else {
        // Friday to Sunday: 7:00 AM to 7:00 PM
        startHour = 7;
        startMinute = 0;
    }
    
    const endHour = 19; // 7:00 PM
    const endMinute = 0;
    
    const timeSlots = [];
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
        const timeString = String(currentHour).padStart(2, '0') + ':' + String(currentMinute).padStart(2, '0');
        timeSlots.push(timeString);
        
        // Increment by 30 minutes
        currentMinute += 30;
        if (currentMinute >= 60) {
            currentMinute = 0;
            currentHour += 1;
        }
    }
    
    return timeSlots;
}

// Function to update time slot dropdowns
function updateTimeSlots() {
    const fechaInput = document.getElementById('bookingFecha');
    const horaSelect = document.getElementById('bookingHora');
    const horaAlternativaSelect = document.getElementById('bookingHoraAlternativa');
    
    if (!fechaInput || !horaSelect) return;
    
    const selectedDate = fechaInput.value;
    const timeSlots = getTimeSlots(selectedDate);
    
    // Clear existing options (except the first one)
    horaSelect.innerHTML = '<option value="">Seleccione hora</option>';
    horaAlternativaSelect.innerHTML = '<option value="">Seleccione hora alternativa</option>';
    
    // Add time slots
    timeSlots.forEach(time => {
        const option1 = document.createElement('option');
        option1.value = time;
        option1.textContent = time;
        horaSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = time;
        option2.textContent = time;
        horaAlternativaSelect.appendChild(option2);
    });
}

// Booking Modal Functions
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Ensure minimum date is set
        const today = new Date().toISOString().split('T')[0];
        const fechaInput = document.getElementById('bookingFecha');
        if (fechaInput) {
            fechaInput.setAttribute('min', today);
            // Reset time slots if date is already selected
            if (fechaInput.value) {
                updateTimeSlots();
            }
        }
    }
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeBookingModal();
    }
});

// Booking Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const nombre = document.getElementById('bookingNombre').value;
            const email = document.getElementById('bookingEmail').value;
            const telefono = document.getElementById('bookingTelefono').value;
            const direccion = document.getElementById('bookingDireccion').value;
            const tipoPropiedad = document.getElementById('bookingTipoPropiedad').value;
            const numeroVentanas = document.getElementById('bookingNumeroVentanas').value;
            const frecuencia = document.getElementById('bookingFrecuencia').value;
            const fecha = document.getElementById('bookingFecha').value;
            const hora = document.getElementById('bookingHora').value;
            const horaAlternativa = document.getElementById('bookingHoraAlternativa').value || 'No especificada';
            const notas = document.getElementById('bookingNotas').value || 'Ninguna';
            
            // Format date
            const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Create email body
            const subject = encodeURIComponent('Nueva Reserva Online - Cristal Claro');
            const body = encodeURIComponent(
                'NUEVA RESERVA DE SERVICIO\n\n' +
                '═══════════════════════════════════════\n\n' +
                'INFORMACIÓN DEL CLIENTE:\n' +
                'Nombre: ' + nombre + '\n' +
                'Email: ' + email + '\n' +
                'Teléfono: ' + telefono + '\n' +
                'Dirección: ' + direccion + '\n\n' +
                'DETALLES DEL SERVICIO:\n' +
                'Tipo de Propiedad: ' + tipoPropiedad + '\n' +
                'Número de Ventanas: ' + numeroVentanas + '\n' +
                'Frecuencia: ' + frecuencia + '\n\n' +
                'FECHA Y HORA:\n' +
                'Fecha Preferida: ' + fechaFormateada + ' (' + fecha + ')\n' +
                'Hora Preferida: ' + hora + '\n' +
                'Hora Alternativa: ' + horaAlternativa + '\n\n' +
                'NOTAS ADICIONALES:\n' + notas + '\n\n' +
                '═══════════════════════════════════════\n' +
                'Reserva realizada desde el sitio web.\n' +
                'Por favor, confirme la disponibilidad y contacte al cliente.'
            );
            
            // Create mailto link
            const mailtoLink = 'mailto:eslimjallow@gmail.com?subject=' + subject + '&body=' + body;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showBookingSuccess();
            
            // Close modal and reset form after a delay
            setTimeout(function() {
                bookingForm.reset();
                closeBookingModal();
            }, 1500);
        });
    }
});

function showBookingSuccess() {
    // Create success message
    const successMsg = document.createElement('div');
    successMsg.className = 'form-success';
    successMsg.textContent = '✓ ¡Reserva enviada! Su cliente de correo se abrirá para confirmar la reserva.';
    
    const form = document.getElementById('bookingForm');
    if (form) {
        form.insertBefore(successMsg, form.firstChild);
        successMsg.classList.add('show');
        
        // Scroll to success message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Remove after 5 seconds
        setTimeout(function() {
            successMsg.remove();
        }, 5000);
    }
}

// Observe service cards and feature items
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .contact-item, .process-step, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
