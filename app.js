document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------
    // 1. FULLSCREEN 3D INTERACTIVE CONNECTION PARTICLES & TARGET LINES
    // -------------------------------------------------------------
    const connCanvas = document.getElementById('connection-3d-canvas');
    if (connCanvas) {
        const cctx = connCanvas.getContext('2d');
        let width = connCanvas.width = window.innerWidth;
        let height = connCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = connCanvas.width = window.innerWidth;
            height = connCanvas.height = window.innerHeight;
        });

        // 3D Particles
        const particleCount = 45;
        const particles3D = [];

        for (let i = 0; i < particleCount; i++) {
            particles3D.push({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random() * 200 + 10,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                vz: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2.5 + 1
            });
        }

        let mouseX = width / 2;
        let mouseY = height / 2;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate3DConnections() {
            cctx.clearRect(0, 0, width, height);

            // Find all interactive node target elements (user photo card, project cards)
            const targetEls = document.querySelectorAll('.interactive-node-target');
            const targetCenters = [];

            targetEls.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < height && rect.bottom > 0) {
                    targetCenters.push({
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                    });
                }
            });

            // Update & render 3D particles
            particles3D.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;
                p.z += p.vz;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
                if (p.z < 1 || p.z > 300) p.vz *= -1;

                // Perspective projection
                const scale = 200 / (200 + p.z);
                const px = (p.x - width / 2) * scale + width / 2;
                const py = (p.y - height / 2) * scale + height / 2;
                const pr = p.radius * scale;

                cctx.beginPath();
                cctx.arc(px, py, pr, 0, Math.PI * 2);
                cctx.fillStyle = `rgba(61, 124, 91, ${scale * 0.7})`;
                cctx.shadowBlur = 10 * scale;
                cctx.shadowColor = '#66bb8a';
                cctx.fill();

                // Connect to mouse cursor if close
                const mdist = Math.hypot(px - mouseX, py - mouseY);
                if (mdist < 180) {
                    cctx.beginPath();
                    cctx.moveTo(px, py);
                    cctx.lineTo(mouseX, mouseY);
                    cctx.strokeStyle = `rgba(116, 198, 157, ${(1 - mdist / 180) * 0.4})`;
                    cctx.lineWidth = 1;
                    cctx.stroke();
                }

                // Connect particles to nearest target elements (User photo & project cards)
                targetCenters.forEach(tc => {
                    const tdist = Math.hypot(px - tc.x, py - tc.y);
                    if (tdist < 220) {
                        cctx.beginPath();
                        cctx.moveTo(px, py);
                        cctx.lineTo(tc.x, tc.y);
                        cctx.strokeStyle = `rgba(61, 124, 91, ${(1 - tdist / 220) * 0.35})`;
                        cctx.lineWidth = 1.2;
                        cctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate3DConnections);
        }

        animate3DConnections();
    }

    // -------------------------------------------------------------
    // 2. INTERACTIVE FLOATING SKILL BUBBLES CANVAS (MATCHING SCREENSHOT 2)
    // -------------------------------------------------------------
    const canvas = document.getElementById('skills-bubble-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;
        let width = canvas.width = container.clientWidth;
        let height = canvas.height = container.clientHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = container.clientWidth;
            height = canvas.height = container.clientHeight;
            initBubbles();
        });

        const skillItems = [
            { name: 'Python', category: 'Languages', size: 46, clusterX: 0.25, clusterY: 0.3 },
            { name: 'Java', category: 'Languages', size: 36, clusterX: 0.22, clusterY: 0.65 },
            { name: 'Problem\nSolving', category: 'Languages', size: 48, clusterX: 0.33, clusterY: 0.5 },
            
            { name: 'OpenCV', category: 'Data & AI', size: 42, clusterX: 0.52, clusterY: 0.22 },
            { name: 'Generative AI\n& LLMs', category: 'Data & AI', size: 52, clusterX: 0.58, clusterY: 0.45 },
            { name: 'Pytesseract', category: 'Data & AI', size: 40, clusterX: 0.56, clusterY: 0.62 },
            { name: 'NumPy &\nPandas', category: 'Data & AI', size: 48, clusterX: 0.47, clusterY: 0.72 },

            { name: 'HTML5', category: 'Web', size: 36, clusterX: 0.72, clusterY: 0.28 },
            { name: 'JS (ES6+)', category: 'Web', size: 44, clusterX: 0.81, clusterY: 0.42 },
            { name: 'CSS3', category: 'Web', size: 34, clusterX: 0.70, clusterY: 0.58 },
            { name: 'Flask /\nExpress', category: 'Web', size: 42, clusterX: 0.79, clusterY: 0.68 }
        ];

        let bubbles = [];

        function initBubbles() {
            bubbles = skillItems.map(item => {
                const baseX = item.clusterX * width;
                const baseY = item.clusterY * height;
                return {
                    name: item.name,
                    category: item.category,
                    radius: item.size,
                    baseRadius: item.size,
                    x: baseX + (Math.random() - 0.5) * 30,
                    y: baseY + (Math.random() - 0.5) * 30,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    baseX: baseX,
                    baseY: baseY
                };
            });
        }

        initBubbles();

        let smouseX = -1000;
        let smouseY = -1000;

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            smouseX = e.clientX - rect.left;
            smouseY = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            smouseX = -1000;
            smouseY = -1000;
        });

        function animateBubbles() {
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = '#66bb8a';
            ctx.font = '600 20px "Playfair Display", serif';
            ctx.textAlign = 'center';
            ctx.fillText('Languages', width * 0.26, height * 0.52);

            ctx.fillStyle = '#c7b07b';
            ctx.fillText('Data & AI', width * 0.52, height * 0.48);

            ctx.fillStyle = '#9ba19d';
            ctx.fillText('Web', width * 0.76, height * 0.50);

            bubbles.forEach(b => {
                const dx = b.baseX - b.x;
                const dy = b.baseY - b.y;
                b.vx += dx * 0.0008;
                b.vy += dy * 0.0008;

                const mdx = b.x - smouseX;
                const mdy = b.y - smouseY;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mdist < b.radius + 50) {
                    const force = (1 - mdist / (b.radius + 50)) * 2;
                    b.vx += (mdx / mdist) * force;
                    b.vy += (mdy / mdist) * force;
                    b.radius = Math.min(b.baseRadius * 1.15, b.radius + 1);
                } else {
                    b.radius = Math.max(b.baseRadius, b.radius - 0.5);
                }

                b.vx *= 0.95;
                b.vy *= 0.95;
                b.x += b.vx;
                b.y += b.vy;

                ctx.save();
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);

                const grad = ctx.createRadialGradient(
                    b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.1,
                    b.x, b.y, b.radius
                );
                grad.addColorStop(0, 'rgba(80, 90, 85, 0.9)');
                grad.addColorStop(1, 'rgba(40, 45, 43, 0.95)');

                ctx.fillStyle = grad;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                ctx.shadowBlur = 15;
                ctx.fill();

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 0;
                ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const lines = b.name.split('\n');
                if (lines.length === 1) {
                    ctx.fillText(lines[0], b.x, b.y);
                } else {
                    ctx.fillText(lines[0], b.x, b.y - 7);
                    ctx.fillText(lines[1], b.x, b.y + 7);
                }

                ctx.restore();
            });

            requestAnimationFrame(animateBubbles);
        }

        animateBubbles();
    }

    // -------------------------------------------------------------
    // 3. SEARCH MODAL LOGIC
    // -------------------------------------------------------------
    const searchBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const closeSearch = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', () => {
            searchModal.classList.remove('hidden');
            searchInput.focus();
        });

        closeSearch.addEventListener('click', () => {
            searchModal.classList.add('hidden');
        });

        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) searchModal.classList.add('hidden');
        });

        const itemsToSearch = [
            { title: 'Python', section: 'Skills', link: '#skills' },
            { title: 'OpenCV', section: 'Skills', link: '#skills' },
            { title: 'Generative AI & LLMs', section: 'Skills', link: '#skills' },
            { title: 'Data Engineer Intern (Positive Integers)', section: 'Experience', link: '#experience' },
            { title: 'Bank Check Data Extraction System', section: 'Experience', link: '#experience' },
            { title: 'Smart Waste Segregation System', section: 'Projects', link: '#projects' },
            { title: 'Connected Apartment Concept', section: 'Projects', link: '#projects' },
            { title: 'Sri Sairam Institute of Technology', section: 'Education', link: '#education' }
        ];

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            searchResults.innerHTML = '';

            if (query === '') return;

            const filtered = itemsToSearch.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.section.toLowerCase().includes(query)
            );

            if (filtered.length === 0) {
                searchResults.innerHTML = '<p style="color:#9ba19d; padding:10px 0;">No matching items found.</p>';
            } else {
                filtered.forEach(item => {
                    const div = document.createElement('div');
                    div.style.padding = '10px 0';
                    div.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
                    div.style.cursor = 'pointer';
                    div.innerHTML = `<strong style="color:#fff;">${item.title}</strong> <span style="color:#c7b07b; font-size:0.8rem; margin-left:8px;">${item.section}</span>`;
                    div.addEventListener('click', () => {
                        searchModal.classList.add('hidden');
                        document.querySelector(item.link).scrollIntoView({ behavior: 'smooth' });
                    });
                    searchResults.appendChild(div);
                });
            }
        });
    }

    // -------------------------------------------------------------
    // 4. NAVIGATION ACTIVE LINK HIGHLIGHTING ON SCROLL
    // -------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 120) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
