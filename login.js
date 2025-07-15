function handleCredentialResponse(response) {
    // Decode JWT to get user info
    const responsePayload = parseJwt(response.credential);

    // Store user info in session storage to pass to the chat page
    sessionStorage.setItem('userInfo', JSON.stringify({
        name: responsePayload.name,
        email: responsePayload.email,
        picture: responsePayload.picture
    }));

    // Redirect to the chat page
    window.location.href = 'chat.html';
}

function parseJwt (token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}