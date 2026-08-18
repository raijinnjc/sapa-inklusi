/**
 * SAPA INKLUSI - Application UI Helper & Tailwind Setup
 */

// Configure Tailwind theme extensions dynamically
if (window.tailwind) {
    tailwind.config = {
        darkMode: "class",
        theme: {
            extend: {
                colors: {
                    "primary": "#9a461b",
                    "primary-container": "#e88252",
                    "on-primary": "#ffffff",
                    "on-primary-container": "#5e2100",
                    "primary-fixed": "#ffdbcd",
                    "primary-fixed-dim": "#ffb595",
                    "secondary": "#546430",
                    "secondary-container": "#d4e7a6",
                    "on-secondary": "#ffffff",
                    "on-secondary-container": "#586834",
                    "secondary-fixed": "#d7eaa8",
                    "secondary-fixed-dim": "#bbce8e",
                    "tertiary": "#5f5e5b",
                    "tertiary-container": "#9f9d99",
                    "background": "#fbf9f8",
                    "surface": "#fbf9f8",
                    "surface-bright": "#fbf9f8",
                    "surface-container-lowest": "#ffffff",
                    "surface-container-low": "#f6f3f2",
                    "surface-container": "#f0eded",
                    "surface-container-high": "#eae8e7",
                    "surface-container-highest": "#e4e2e1",
                    "surface-dim": "#dcd9d9",
                    "on-surface": "#1b1c1c",
                    "on-surface-variant": "#55433b",
                    "outline": "#88726a",
                    "outline-variant": "#dbc1b7",
                    "error": "#ba1a1a",
                    "error-container": "#ffdad6",
                    "on-error-container": "#93000a"
                },
                borderRadius: {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
                },
                spacing: {
                    "unit": "8px",
                    "gutter": "24px",
                    "container-max": "1200px",
                    "margin-desktop": "40px",
                    "stack-sm": "8px",
                    "stack-md": "16px",
                    "stack-lg": "32px"
                },
                fontFamily: {
                    "headline-xl": ["Plus Jakarta Sans"],
                    "headline-lg": ["Plus Jakarta Sans"],
                    "headline-md": ["Plus Jakarta Sans"],
                    "body-lg": ["Plus Jakarta Sans"],
                    "body-md": ["Plus Jakarta Sans"],
                    "label-md": ["Plus Jakarta Sans"],
                    "caption": ["Plus Jakarta Sans"]
                }
            }
        }
    };
}

// Global Dashboard Filter Logic
function applyDashboardFilters() {
    const filterEl = document.getElementById('filterWilayah');
    if (!filterEl) return;
    const val = filterEl.value;
    if (val !== 'ALL') {
        setKpiValue('kpiPIB', "42");
        setKpiValue('kpiSchools', "14");
        setKpiValue('kpiAssistance', "28");
        setKpiValue('kpiStudents', "64");
    } else {
        resetDashboardFilters();
    }
}

function resetDashboardFilters() {
    const filterEl = document.getElementById('filterWilayah');
    if (filterEl) filterEl.value = 'ALL';
    setKpiValue('kpiPIB', "128");
    setKpiValue('kpiSchools', "46");
    setKpiValue('kpiAssistance', "92");
    setKpiValue('kpiStudents', "214");
}

function setKpiValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}

function resetAllData() {
    if (confirm("Apakah Anda yakin ingin mengembalikan seluruh data ke kondisi bawaan PRD?")) {
        if (window.sapaStore) {
            window.sapaStore.resetToDefault();
            alert("Data berhasil di-reset!");
            location.reload();
        }
    }
}
