document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Toggle hamburger animation
            const spans = mobileMenu.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
                const spans = mobileMenu.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // 3. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.style.background = 'rgba(6, 6, 8, 0.9)';
            navbar.style.borderBottom = '1px solid rgba(114, 137, 218, 0.15)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(6, 6, 8, 0.65)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 4. Interactive Project Cards Parallax & Tilt Effect
    const cards = document.querySelectorAll('.project-card, .lanyard-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.

            // Calculate rotation degrees based on mouse position relative to center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit tilt angles (max 5 degrees)
            const rotateX = ((centerY - y) / centerY) * 4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            
            // Dynamic subtle radial light reflection inside the card
            if (card.classList.contains('opsec')) {
                card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(114, 137, 218, 0.1) 0%, rgba(13, 13, 18, 0.6) 80%)`;
            } else if (card.classList.contains('fcord')) {
                card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 240, 255, 0.08) 0%, rgba(13, 13, 18, 0.6) 80%)`;
            } else {
                card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.03) 0%, rgba(13, 13, 18, 0.6) 80%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            card.style.background = 'var(--card-bg)';
        });
    });

    // 5. Scroll Active Link & Lazy Fade-in Animations
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Update nav link activation
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });

                // Apply dynamic animation entry
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        // Initial state for animation entrance
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        sectionObserver.observe(section);
    });

    // 6. Lanyard Discord API Integration
    const discordId = "1113108440575922236";
    
    async function updateLanyard() {
        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const data = result.data;
                
                // Update display name & username
                const displayNameText = document.getElementById('discord-display-name');
                const usernameText = document.getElementById('discord-username');
                if (displayNameText) {
                    displayNameText.textContent = data.discord_user.global_name || data.discord_user.display_name || data.discord_user.username;
                }
                if (usernameText) {
                    usernameText.textContent = `@${data.discord_user.username}`;
                }
                
                // Update avatar
                const avatarImg = document.getElementById('discord-avatar');
                if (avatarImg) {
                    if (data.discord_user.avatar) {
                        const isAnimated = data.discord_user.avatar.startsWith('a_');
                        avatarImg.src = `https://cdn.discordapp.com/avatars/${discordId}/${data.discord_user.avatar}.${isAnimated ? 'gif' : 'png'}?size=128`;
                    } else {
                        // Fallback default avatar
                        const defaultAvatarIndex = parseInt(discordId.slice(-1)) % 5;
                        avatarImg.src = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
                    }
                }
                
                // Update status dot
                const statusDot = document.getElementById('discord-status-dot');
                if (statusDot) {
                    statusDot.className = `status-dot ${data.discord_status}`;
                }
                
                // Update custom status text
                const customStatus = document.getElementById('discord-custom-status');
                if (customStatus) {
                    const customActivity = data.activities.find(act => act.type === 4);
                    if (customActivity) {
                        let statusText = '';
                        if (customActivity.emoji) {
                            if (customActivity.emoji.id) {
                                statusText += `<img class="status-emoji" src="https://cdn.discordapp.com/emojis/${customActivity.emoji.id}.png?v=1" alt="${customActivity.emoji.name}"> `;
                            } else {
                                statusText += `${customActivity.emoji.name} `;
                            }
                        }
                        statusText += customActivity.state || '';
                        customStatus.innerHTML = statusText || 'En ligne';
                    } else {
                        // Map status directly
                        const statusMap = {
                            'online': 'Disponible sur Discord',
                            'idle': 'Inactif',
                            'dnd': 'Ne pas déranger',
                            'offline': 'Hors ligne'
                        };
                        customStatus.textContent = statusMap[data.discord_status] || 'Hors ligne';
                    }
                }
                
                // Update dynamic activity container
                const activityContainer = document.getElementById('lanyard-activity');
                if (activityContainer) {
                    if (data.listening_to_spotify && data.spotify) {
                        // If Spotify listening
                        activityContainer.innerHTML = `
                            <div class="spotify-activity">
                                <div class="spotify-album-wrapper">
                                    <img class="spotify-album" src="${data.spotify.album_art_url}" alt="Album Art">
                                    <i data-lucide="music" class="spotify-music-icon"></i>
                                </div>
                                <div class="activity-details">
                                    <span class="activity-type">Écoute Spotify</span>
                                    <span class="activity-name">${data.spotify.track}</span>
                                    <span class="activity-state">par ${data.spotify.artist}</span>
                                </div>
                                <div class="spotify-equalizer">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        `;
                    } else {
                        // Check for other standard game activities (type 0)
                        const gameActivity = data.activities.find(act => act.type === 0);
                        if (gameActivity) {
                            activityContainer.innerHTML = `
                                <div class="game-activity">
                                    <i data-lucide="gamepad-2" class="activity-icon" size="24"></i>
                                    <div class="activity-details">
                                        <span class="activity-type">Joue à</span>
                                        <span class="activity-name">${gameActivity.name}</span>
                                        <span class="activity-state">${gameActivity.details || ''} ${gameActivity.state ? ' - ' + gameActivity.state : ''}</span>
                                    </div>
                                </div>
                            `;
                        } else {
                            activityContainer.innerHTML = `
                                <div class="no-activity">
                                    <i data-lucide="coffee" size="20"></i>
                                    <span>Aucune activité détectée</span>
                                </div>
                            `;
                        }
                    }
                    
                    // Re-render Lucide icons injected dynamically
                    lucide.createIcons();
                }
            } else {
                // Fallback display if user is not monitored by Lanyard yet
                const avatarImg = document.getElementById('discord-avatar');
                const statusDot = document.getElementById('discord-status-dot');
                const customStatus = document.getElementById('discord-custom-status');
                
                if (avatarImg) {
                    avatarImg.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                }
                if (statusDot) {
                    statusDot.className = 'status-dot offline';
                }
                if (customStatus) {
                    customStatus.textContent = 'Hors ligne / Non connecté à Lanyard';
                }
            }
        } catch (error) {
            console.error('Error fetching Lanyard status:', error);
        }
    }
    
    // Initial fetch and 10s interval
    updateLanyard();
    setInterval(updateLanyard, 10000);
});
