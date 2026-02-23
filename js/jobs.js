/**
 * HRFA.MA Booking & Job Workflow Logic
 */

const mockJobs = [
    {
        id: 'JOB-001',
        title: 'صباغة غرفة نوم',
        partner: 'ياسين العلوي',
        role: 'provider',
        price: '800 DH',
        date: '2026-02-22',
        status: 'progress',
        icon: 'paint-roller'
    },
    {
        id: 'JOB-002',
        title: 'صباغة واجهة المنزل',
        partner: 'فاطمة المنصوري',
        role: 'user',
        price: '3500 DH',
        date: '2026-02-21',
        status: 'pending',
        icon: 'home'
    }
];

let currentTab = 'active';
let ratingJobId = null;

document.addEventListener('DOMContentLoaded', () => {
    initJobs();
});

function initJobs() {
    renderJobs();

    // Tab Logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.getAttribute('data-tab');
            renderJobs();
        });
    });

    // Star Picker Logic
    const stars = document.querySelectorAll('#star-picker i');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const val = parseInt(star.getAttribute('data-val'));
            stars.forEach((s, idx) => {
                if (idx < val) {
                    s.classList.replace('far', 'fas');
                } else {
                    s.classList.replace('fas', 'far');
                }
            });
        });
    });
}

function renderJobs() {
    const list = document.getElementById('job-list');
    if (!list) return;

    const filtered = mockJobs.filter(j => {
        if (currentTab === 'active') return j.status === 'pending' || j.status === 'progress';
        return j.status === 'completed' || j.status === 'cancelled';
    });

    if (filtered.length === 0) {
        const lang = document.documentElement.lang || 'ar';
        const emptyMsg = translations[lang]?.activity_empty || (lang === 'ar' ? 'ماعندك حتى طلب فهاد القسم.' : 'No requests in this section.');
        list.innerHTML = `<div style="padding: 50px; text-align: center; grid-column: 1/-1; color: var(--color-silver);">${emptyMsg}</div>`;
        return;
    }

    list.innerHTML = filtered.map(job => `
        <div class="job-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                <div style="display: flex; gap: 15px;">
                    <div class="chat-avatar" style="background: var(--color-accent); width: 45px; height: 45px;">
                        <i class="fas fa-${job.icon}"></i>
                    </div>
                    <div>
                        <h4 style="margin-bottom: 2px;">${job.title}</h4>
                        <p style="font-size: 0.85rem; color: var(--color-silver);">${job.partner}</p>
                    </div>
                </div>
                <span class="status-badge status-${job.status}" data-i18n="status_${job.status}">${job.status}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--color-silver); margin-bottom: 20px;">
                <span><i class="far fa-calendar-alt"></i> ${job.date}</span>
                <span style="color: white; font-weight: 700;">${job.price}</span>
            </div>

            <div class="job-actions">
                ${renderActions(job)}
            </div>
        </div>
    `).join('');

    if (window.updateContent) window.updateContent();
}

function renderActions(job) {
    const lang = document.documentElement.lang || 'ar';
    let actions = '';
    if (job.status === 'pending') {
        actions = `
            <button class="btn btn-primary" style="flex: 1;" onclick="updateJobStatus('${job.id}', 'progress')">${translations[lang]?.accept || 'Accept'}</button>
            <button class="btn btn-outline" style="flex: 1;" onclick="updateJobStatus('${job.id}', 'cancelled')">${translations[lang]?.decline || 'Decline'}</button>
        `;
    } else if (job.status === 'progress') {
        actions = `
            <button class="btn btn-primary" style="flex: 1;" onclick="updateJobStatus('${job.id}', 'completed')">${translations[lang]?.mark_as_done || 'Finish'}</button>
            <button class="btn btn-outline" style="flex: 1;" onclick="window.location.href='chat.html'">${translations[lang]?.chat_btn || 'Chat'}</button>
        `;
    } else if (job.status === 'completed' && !job.rated) {
        actions = `<button class="btn btn-outline" style="flex: 1;" onclick="openRating('${job.id}')">${translations[lang]?.rate_service || 'Rate'}</button>`;
    }
    return actions;
}

function updateJobStatus(jobId, newStatus) {
    const lang = document.documentElement.lang || 'ar';
    // Mock logic: Update local array
    const job = mockJobs.find(j => j.id === jobId);
    if (job) {
        job.status = newStatus;
        renderJobs();
        const successMsg = lang === 'ar' ? 'تم تحديث حالة الطلب بنجاح' : 'Status updated successfully';
        if (window.showToast) {
            window.showToast(successMsg, 'success');
        }

        const notifTitle = lang === 'ar' ? 'تحديث الطلب' : 'Request Update';
        const notifDesc = lang === 'ar' ? `الطلب "${job.title}" رجع دابا ${newStatus}` : `Request "${job.title}" is now ${newStatus}`;
        if (window.addNotification) {
            window.addNotification(notifTitle, notifDesc, 'info');
        }
    }
}

function openRating(jobId) {
    ratingJobId = jobId;
    document.getElementById('rating-modal').style.display = 'flex';
}

function closeRating() {
    document.getElementById('rating-modal').style.display = 'none';
}

function submitRating() {
    if (window.showToast) {
        window.showToast('شكرا على التقييم ديالك!', 'success');
    }
    closeRating();
    // In real app, update DB
}

window.updateJobStatus = updateJobStatus;
window.openRating = openRating;
window.closeRating = closeRating;
window.submitRating = submitRating;
