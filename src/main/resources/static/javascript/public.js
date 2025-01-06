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
        window.location.href = '/faq';
    }

    function navigateToLogin() {
        window.location.href = '/account/login';
    }

    function navigateToSignUp() {
        window.location.href = "/account/signup";
    }

    // HTML에서 사용할 수 있도록 함수 내보내기
    window.navigateToHome = navigateToHome;
    window.navigateToAbout = navigateToAbout;
    window.navigateToSession = navigateToSession;
    window.navigateToProject = navigateToProject;
    window.navigateToFAQ = navigateToFAQ;
    window.navigateToLogin = navigateToLogin;
    window.navigateToSignUp = navigateToSignUp;
});