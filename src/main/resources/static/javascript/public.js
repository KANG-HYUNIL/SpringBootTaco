
document.addEventListener("DOMContentLoaded", function() {
    function navigateToHome() {
        window.location.href = '/';
    }

    function navigateToAbout() {
        window.location.href = '/about';
    }

    function navigateToSession() {
        window.location.href = '/session';
    }

    function navigateToProject() {
        window.location.href = '/project';
    }

    function navigateToFAQ() {
        //window.location.href = '/faq';
    }

    function navigateToLogin() {
        window.location.href = '/login';
    }

    // Export functions to be used in HTML
    window.navigateToHome = navigateToHome;
    window.navigateToAbout = navigateToAbout;
    window.navigateToSession = navigateToSession;
    window.navigateToProject = navigateToProject;
    window.navigateToFAQ = navigateToFAQ;
    window.navigateToLogin = navigateToLogin;
});
