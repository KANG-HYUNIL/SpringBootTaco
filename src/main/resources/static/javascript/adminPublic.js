document.addEventListener("DOMContentLoaded", function() {
    function navigateToAdminHome() {
        window.location.href = '/admin/';
    }

    function navigateToAdminProject() {
        window.location.href = '/admin/project';
    }

    function navigateToAdminSession() {
        window.location.href = '/admin/session';
    }

    // Export functions to be used in HTML
    window.navigateToAdminHome = navigateToAdminHome;
    window.navigateToAdminProject = navigateToAdminProject;
    window.navigateToAdminSession = navigateToAdminSession;
});