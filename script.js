document.addEventListener('DOMContentLoaded', function() {

    gsap.registerPlugin(ScrollTrigger);



    // --- CURSOR FOLLOWER ---

    const cursor = document.querySelector('.cursor-follower');

    window.addEventListener('mousemove', e => {

        gsap.to(cursor, {

            duration: 0.3,

            x: e.clientX,

            y: e.clientY,

            ease: 'power2.out'

        });

    });



    // --- NAVBAR SCROLL EFFECT ---

    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {

        if (window.scrollY > 50) {

            navbar.classList.add('scrolled');

        } else {

            navbar.classList.remove('scrolled');

        }

    });



    // --- SWIPER INITIALIZATION (FOR PROJECTS) ---

    var swiper = new Swiper('.swiper-container', {

        effect: 'coverflow',

        grabCursor: true,

        centeredSlides: true,

        slidesPerView: 'auto',

        loop: true,

        autoplay: {
          delay: 2500, // Time in ms between slides (2.5 seconds)
          disableOnInteraction: true, // Autoplay stops if you manually swipe
        },

        coverflowEffect: {

            rotate: 50,

            stretch: 0,

            depth: 100,

            modifier: 1,

            slideShadows: true,

        },

        pagination: {

            el: '.swiper-pagination',

            clickable: true,

        },

    });
    
    // --- AUTOMATION SLIDESHOW LOGIC (CORRECTED FOR SMOOTH FADE) ---
    let slideIndex = 0;
    showAutomationSlides();

    function showAutomationSlides() {
        const slides = document.querySelectorAll(".automation-slide");
        const dots = document.querySelectorAll(".dot");
        
        if (slides.length === 0 || dots.length === 0) return;

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }
        
        if (slides[slideIndex - 1] && dots[slideIndex - 1]) {
            slides[slideIndex - 1].classList.add('active');
            dots[slideIndex - 1].classList.add('active');
        }
        
        setTimeout(showAutomationSlides, 3000); 
    }


    // --- GEMINI API INTEGRATION ---

    const modal = document.getElementById('gemini-modal');

    const closeModalBtn = document.getElementById('close-modal');

    const geminiResponseEl = document.getElementById('gemini-response');

    const loader = document.querySelector('.loader');



    const API_KEY = "YOUR_API_KEY_HERE";

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    async function callGeminiAPI(prompt, button) {

        loader.style.display = 'block';

        button.disabled = true;

        modal.classList.add('visible');

        geminiResponseEl.innerHTML = '<p>Generating summary...</p>';



        const payload = {

            contents: [{

                parts: [{ text: prompt }]

            }],

        };



        try {

            const response = await fetch(API_URL, {

                method: 'POST',

                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify(payload)

            });



            if (!response.ok) {

               throw new Error(`HTTP error! status: ${response.status}`);

            }
            
            const result = await response.json();

            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;



            if (text) {

                let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
                html = html.replace(/\n/g, '<br>');
                geminiResponseEl.innerHTML = html;

            } else {

                geminiResponseEl.textContent = 'Sorry, the AI could not generate a summary. Please try again later.';

            }
            
        } catch (error) {

            console.error("Gemini API call failed:", error);

            geminiResponseEl.textContent = 'An error occurred while contacting the AI. Make sure your API key is correct and valid.';

        } finally {

            loader.style.display = 'none';

            button.disabled = false;

        }

    }
    
    document.querySelectorAll('.btn-ai').forEach(button => {

        button.addEventListener('click', (e) => {

            const slide = e.target.closest('.swiper-slide');

            const projectTitle = slide.querySelector('h3').textContent;

            const projectDesc = slide.querySelector('p').textContent;



            const prompt = `
                As a professional tech recruiter, write an expanded, impressive summary for a data analysis project.
                
                Project Title: "${projectTitle}"
                Original Description: "${projectDesc}"

                Your summary should be 1-2 paragraphs long. Elaborate on the potential business impact, the technical skills demonstrated (like Python, SQL, Tableau, Power BI, machine learning), and the analytical mindset required. Make it sound compelling for a job application or portfolio review.
            `;
            
            callGeminiAPI(prompt, button);

        });

    });



    closeModalBtn.addEventListener('click', () => modal.classList.remove('visible'));

    modal.addEventListener('click', (e) => {

        if (e.target === modal) {

            modal.classList.remove('visible');

        }

    });



    // --- GSAP ANIMATIONS ---
    const heroTimeline = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' }});
    heroTimeline.fromTo('.hero-title', { opacity: 0, y: -50 }, { opacity: 1, y: 0, delay: 0.2 })
    .fromTo('.tagline', { opacity: 0, y: -30 }, { opacity: 1, y: 0 }, "-=0.5")
    .fromTo('.mission', { opacity: 0, y: -20 }, { opacity: 1, y: 0 }, "-=0.6")
    .fromTo('.hero-buttons .btn', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2 }, "-=0.5");

    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            opacity: 0, y: 30, duration: 0.8,
            scrollTrigger: { trigger: title, start: 'top 90%', toggleActions: 'play none none reverse' }
        });
    });

    const aboutContent = document.querySelector('.about-content');
    gsap.from('.anim-pic', {
        x: -100, opacity: 0, duration: 1,
        scrollTrigger: { trigger: aboutContent, start: 'top 80%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.anim-text', {
        x: 100, opacity: 0, duration: 1,
        scrollTrigger: { trigger: aboutContent, start: 'top 80%', toggleActions: 'play none none reverse' }
    });

    gsap.utils.toArray('.stat-number').forEach(stat => {
        const target = parseInt(stat.dataset.target, 10);
        gsap.to(stat, {
            innerText: target, duration: 2, ease: 'power1.out', snap: { innerText: 1 },
            scrollTrigger: { trigger: stat, start: 'top 90%', toggleActions: 'play none none reverse' }
        });
    });
    
    gsap.from('.skill-category', {
        opacity: 0, y: 50, scale: 0.9, duration: 0.5, stagger: 0.2,
        scrollTrigger: { trigger: '.skills-grid', start: 'top 80%', toggleActions: 'play none none reverse' }
    });

    gsap.from('.swiper-container', {
        opacity: 0, scale: 0.8, duration: 1,
        scrollTrigger: { trigger: '.projects', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
    
    gsap.from('.experience-item', {
        opacity: 0, x: -100, duration: 0.8,
        scrollTrigger: { trigger: '.experience-item', start: 'top 85%', toggleActions: 'play none none reverse' }
    });
    
    gsap.from('.blog-card', {
        opacity: 0, y: 50, duration: 0.5, stagger: 0.2,
        scrollTrigger: { trigger: '.blog-grid', start: 'top 85%', toggleActions: 'play none none reverse' }
    });

    // --- BACKGROUND GRADIENT CHANGE ON SCROLL ---
    const sections = gsap.utils.toArray('main section');
    const bgColors = {
        'about': { start: '#111827', end: '#1e3a5f' }, 'stats': { start: '#1e3a5f', end: '#0c2d48' },
        'skills': { start: '#0c2d48', end: '#144272' }, 'projects': { start: '#144272', end: '#0A2647' },
        'automation': { start: '#0A2647', end: '#091c33' },
        'experience': { start: '#091c33', end: '#08192c' },
        'blog': { start: '#08192c', end: '#102d4d' },
    };

    sections.forEach(section => {
        if(bgColors[section.id]) {
            ScrollTrigger.create({
                trigger: section,
                start: 'top 50%', end: 'bottom 50%',
                onEnter: () => gsap.to('body', {
                    '--background-start': bgColors[section.id].start,
                    '--background-end': bgColors[section.id].end,
                    duration: 1.2
                }),
                onEnterBack: () => gsap.to('body', {
                    '--background-start': bgColors[section.id].start,
                    '--background-end': bgColors[section.id].end,
                    duration: 1.2
                }),
            });
        }
    });

    ScrollTrigger.create({
        trigger: '.about', start: 'top 80%',
        onLeaveBack: () => gsap.to('body', {
            '--background-start': '#0a0f1f', '--background-end': '#101d42', duration: 1.2
        })
    });
     ScrollTrigger.create({
        trigger: '.contact', start: 'top 80%',
        onEnter: () => gsap.to('body', {
            '--background-start': '#102d4d', '--background-end': '#0a0f1f', duration: 1.2
        }),
        onLeaveBack: () => gsap.to('body', {
             '--background-start': bgColors['blog'].start, '--background-end': bgColors['blog'].end, duration: 1.2
        }),
    });
});

