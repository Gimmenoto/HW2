if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('sw1.js')
            .then(registration => {
                console.log('Service Worker: Registered within scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker: Registration failed:', error);
            });
    });
}