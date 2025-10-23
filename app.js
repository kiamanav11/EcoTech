/* app.js - EcoTech interactions
   - Save as app.js in same folder as index.html
*/

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const loader = document.getElementById('loader');
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('main-nav');
  const darkToggle = document.getElementById('darkToggle');
  const joinBtn = document.getElementById('joinBtn');
  const counters = document.querySelectorAll('.counter');
  const pledgeForm = document.getElementById('pledgeForm');
  const pledgeMsg = document.getElementById('pledgeMsg');
  const clearPledge = document.getElementById('clearPledge');
  const tipBox = document.getElementById('tipBox');
  const miniBtns = document.querySelectorAll('.mini-btn');
  const leaderBoard = document.getElementById('leaderboard');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const closeModal = document.getElementById('closeModal');
  const detailBtns = document.querySelectorAll('.detail-btn');

  // Simulate loader then hide
  setTimeout(()=> {
    loader.style.display = 'none';
    loader.setAttribute('aria-hidden','true');
  }, 850); // quick but noticeable

  // Toggle mobile menu
  menuBtn && menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    nav.style.display = expanded ? 'none' : 'flex';
  });

  // Dark mode toggle: toggle class on body
  darkToggle && darkToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    darkToggle.setAttribute('aria-pressed', String(isDark));
    if (isDark) {
      // subtle dark theme adjustments
      document.documentElement.style.setProperty('--bg','#05060b');
    } else {
      document.documentElement.style.removeProperty('--bg');
    }
  });

  // Join button interaction: scroll to pledge and animate
  joinBtn && joinBtn.addEventListener('click', () => {
    document.getElementById('getinvolved').scrollIntoView({behavior:'smooth'});
    // highlight pledge form
    pledgeForm.style.boxShadow = '0 18px 80px rgba(0,208,132,0.08)';
    setTimeout(()=> pledgeForm.style.boxShadow = '', 2200);
  });

  // Animated counters (only when visible)
  const runCounters = () => {
    counters.forEach(counter => {
      const target = +counter.dataset.target;
      const duration = 1800;
      let start = 0;
      const step = Math.ceil(target / (duration / 30));
      const run = () => {
        start += step;
        if (start >= target) {
          counter.textContent = target.toLocaleString();
        } else {
          counter.textContent = start.toLocaleString();
          requestAnimationFrame(run);
        }
      };
      run();
    });
  };

  // Intersection observer to trigger counters when hero is in view
  const hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounters();
          obs.disconnect();
        }
      });
    }, {threshold: 0.25});
    obs.observe(hero);
  } else {
    // Fallback
    runCounters();
  }

  // Simple tip carousel
  const tips = [
    "Turn off chargers when phones are full—save energy and money.",
    "Plant native trees: less water, more local wildlife.",
    "Organize an e-waste drive—old phones = recoverable metals.",
    "Switch one classroom light to LED—immediate savings.",
    "Use a cloth for device cleaning—avoid liquids and damage."
  ];
  let tipIndex = 0;
  setInterval(() => {
    tipIndex = (tipIndex + 1) % tips.length;
    if (tipBox) tipBox.textContent = tips[tipIndex];
  }, 3000);

  // mini buttons show quote in tip box
  miniBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.quote || 'Take action—small steps matter.';
      tipBox.textContent = q;
    });
  });

  // Pledge form behavior: store pledges in localStorage and show leaderboard
  const PLEDGES_KEY = 'ecotech_pledges';
  const getPledges = () => JSON.parse(localStorage.getItem(PLEDGES_KEY) || '[]');

  const renderLeaderboard = () => {
    const pledges = getPledges();
    const counts = {};
    pledges.forEach(p => counts[p.action] = (counts[p.action] || 0) + 1);
    const entries = Object.entries(counts).sort((a,b)=> b[1]-a[1]);
    leaderBoard.innerHTML = '';
    if (entries.length === 0) {
      leaderBoard.innerHTML = '<li class="muted">No pledges yet — be the first!</li>';
      return;
    }
    entries.forEach(([action, c]) => {
      const li = document.createElement('li');
      li.textContent = `${action} — ${c} pledge${c>1 ? 's' : ''}`;
      leaderBoard.appendChild(li);
    });
  };

  // on submit
  pledgeForm && pledgeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('pname').value || '').trim();
    const action = (document.getElementById('action').value || '').trim();
    const why = (document.getElementById('why').value || '').trim();

    if (!name || !action) {
      pledgeMsg.textContent = 'Please enter your name and choose an action.';
      return;
    }
    const pledges = getPledges();
    pledges.push({name, action, why, time: new Date().toISOString()});
    localStorage.setItem(PLEDGES_KEY, JSON.stringify(pledges));
    pledgeMsg.textContent = `🌿 Thanks, ${name.split(' ')[0]}! Your pledge to "${action}" is recorded.`;
    pledgeForm.reset();
    renderLeaderboard();
  });

  clearPledge && clearPledge.addEventListener('click', () => {
    pledgeForm.reset();
    pledgeMsg.textContent = '';
  });

  // Initial leaderboard render
  renderLeaderboard();

  // Card detail modal content (engaging, rich content)
  function getDetailContent(topic) {
    const styl = (s) => `<p style="color:var(--muted)">${s}</p>`;
    const bold = (s) => `<strong style="color:var(--accent1)">${s}</strong>`;
    if (topic === 'smart-solar') {
      return `<h3>Smart Solar Grids — how they work</h3>
        ${styl('Smart inverters and tiny neighbourhood batteries match supply with demand. An AI brain shifts power where it is needed and stores the rest.')}
        <ul>
          <li>${bold('Impact:')} lowers peak-hour demand and reduces backups to fossil fuel plants.</li>
          <li>${bold('Try:')} measure your household consumption for a day and propose 1 appliance to shift to off-peak hours.</li>
        </ul>`;
    } else if (topic === 'ev') {
      return `<h3>Electric Mobility — silent, efficient, human</h3>
        ${styl('Electric vehicles cut local air pollution and are more efficient than petrol engines. Shared e-bikes reduce short trips and traffic.')}`;
    } else if (topic === 'ewaste') {
      return `<h3>E-waste Recycling — treasure in trash</h3>
        ${styl('Phones and motherboards hold small quantities of metals like gold and copper. Recycling recovers them and prevents toxic leaching.')}`;
    } else if (topic === 'green-arch') {
      return `<h3>Green Architecture — design that breathes</h3>
        ${styl('Green roofs, shade trees and smart ventilation reduce energy use and make cities cooler and healthier.')}`;
    }
    return `<h3>EcoTech</h3><p class="muted">Explore the idea to learn more.</p>`;
  }

  // Open modal when clicking card buttons
  detailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.dataset.topic;
      modalBody.innerHTML = getDetailContent(topic);
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'flex';
    });
  });

  closeModal.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
  });

  // Click outside modal closes it
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
    }
  });

  // Image gallery click to open in new tab (simple, no external libs)
  document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      window.open(src, '_blank');
    });
  });

  // Keyboard: allow Esc to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.setAttribute('aria-hidden','true');
      modal.style.display = 'none';
    }
  });

  // Accessibility: simple skip-to content if needed (not shown)

  // Final tiny flourish: animate nav links on load
  document.querySelectorAll('.nav-link').forEach((a, i) => {
    a.style.transform = 'translateY(6px)';
    a.style.opacity = '0';
    setTimeout(()=> {
      a.style.transition = 'all .45s cubic-bezier(.2,.9,.2,1)';
      a.style.transform = '';
      a.style.opacity = '';
    }, 80 + i * 80);
  });
});
