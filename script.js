/* --- Canvas Scroll Animation --- */
const canvas = document.getElementById('scrollCanvas');
const context = canvas ? canvas.getContext('2d') : null;
const frameCount = 192;
const images = [];

if (canvas && context) {
    const currentFrame = index => (
        `Frames/frame_${index.toString().padStart(6, '0')}.jpg`
    );

    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    if (images[0]) {
        images[0].onload = function () {
            canvas.width = images[0].width;
            canvas.height = images[0].height;
            context.drawImage(images[0], 0, 0);
        };
    }

    const updateImage = index => {
        if (images[index] && images[index].complete) {
            if (canvas.width !== images[index].width) {
                canvas.width = images[index].width;
                canvas.height = images[index].height;
            }
            context.drawImage(images[index], 0, 0);
        }
    };

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;

        if (maxScrollTop > 0) {
            const scrollFraction = scrollTop / maxScrollTop;
            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(scrollFraction * frameCount)
            );
            requestAnimationFrame(() => updateImage(frameIndex));
        }
    });
}

/* --- Contact Form Validation & Real Email Dispatch --- */
const form = document.getElementById('contactForm');
const statusBox = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

const fields = {
    name: {
        el: document.getElementById('name'),
        err: document.getElementById('nameError'),
        validate: value => value.trim().length >= 2,
        message: 'Name must be at least 2 characters.'
    },
    email: {
        el: document.getElementById('email'),
        err: document.getElementById('emailError'),
        validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
        message: 'Please provide a valid email address.'
    },
    subject: {
        el: document.getElementById('subject'),
        err: document.getElementById('subjectError'),
        validate: value => value.trim().length >= 3,
        message: 'Subject must be at least 3 characters.'
    },
    message: {
        el: document.getElementById('message'),
        err: document.getElementById('messageError'),
        validate: value => value.trim().length >= 10,
        message: 'Message must be at least 10 characters long.'
    }
};

const validateField = (key) => {
    const field = fields[key];
    const isValid = field.validate(field.el.value);

    if (!isValid) {
        field.el.classList.add('invalid');
        field.err.textContent = field.message;
    } else {
        field.el.classList.remove('invalid');
        field.err.textContent = '';
    }
    return isValid;
};

// Real-time inline feedback
Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('input', () => validateField(key));
});

// Asynchronous form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let allValid = true;
    Object.keys(fields).forEach(key => {
        const isValid = validateField(key);
        if (!isValid) allValid = false;
    });

    if (!allValid) {
        statusBox.className = 'form-status error';
        statusBox.textContent = 'Please fix the errors before submitting.';
        return;
    }

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    statusBox.className = 'form-status success';
    statusBox.textContent = 'Sending message to gladiator5995@gmail.com...';

    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            statusBox.className = 'form-status success';
            statusBox.textContent = `Thanks ${fields.name.el.value.trim()}! Your message has been sent to Ashaz Patel.`;
            form.reset();
        } else {
            // Fallback for direct mailto trigger if third-party endpoint is unverified
            window.location.href = `mailto:gladiator5995@gmail.com?subject=${encodeURIComponent(fields.subject.el.value)}&body=${encodeURIComponent(fields.message.el.value)}`;
            statusBox.className = 'form-status success';
            statusBox.textContent = 'Opening your email client to send message...';
        }
    } catch (err) {
        window.location.href = `mailto:gladiator5995@gmail.com?subject=${encodeURIComponent(fields.subject.el.value)}&body=${encodeURIComponent(fields.message.el.value)}`;
        statusBox.className = 'form-status success';
        statusBox.textContent = 'Opening your email client to send message...';
    } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        setTimeout(() => {
            statusBox.style.display = 'none';
        }, 6000);
    }
});