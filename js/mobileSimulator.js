/**
 * SAPA INKLUSI - Simulator Mobile Application Controller
 */

function switchMobileTab(tabId) {
    const tabs = ['tabBeranda', 'tabMicro', 'tabAsisten', 'tabSekolah'];
    tabs.forEach(t => {
        const el = document.getElementById(t);
        if (el) el.classList.add('hidden');
    });
    const activeEl = document.getElementById(tabId);
    if (activeEl) activeEl.classList.remove('hidden');

    // Update bottom nav button active states
    const navMap = {
        'tabBeranda': 'navBeranda',
        'tabMicro': 'navMicro',
        'tabAsisten': 'navAsisten',
        'tabSekolah': 'navSekolah'
    };
    Object.keys(navMap).forEach(k => {
        const btn = document.getElementById(navMap[k]);
        if (!btn) return;
        if (k === tabId) {
            btn.className = "flex flex-col items-center text-primary font-bold";
        } else {
            btn.className = "flex flex-col items-center text-on-surface-variant hover:text-primary";
        }
    });
}
