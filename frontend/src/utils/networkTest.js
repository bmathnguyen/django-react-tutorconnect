// src/utils/networkTest.js
// Add this file to test your backend connection

export const testBackendConnection = async () => {
    const testUrls = [
      'http://localhost:8000/api',
      'http://10.0.2.2:8000/api', // Android emulator
      'http://157.66.47.161/api', // Your VPS
    ];
  
    for (const baseUrl of testUrls) {
      try {
        console.log(`Testing connection to: ${baseUrl}`);
        
        const response = await fetch(`${baseUrl}/platform/stats/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        });
  
        console.log(`Response from ${baseUrl}:`, {
          status: response.status,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Successfully connected to ${baseUrl}`, data);
          return baseUrl;
        }
      } catch (error) {
        console.log(`❌ Failed to connect to ${baseUrl}:`, error.message);
      }
    }
  
    console.log('❌ All connection attempts failed');
    return null;
  };
  
  // Test function to call from your component
  export const runNetworkTest = async () => {
    console.log('=== Starting Network Test ===');
    const workingUrl = await testBackendConnection();
    console.log('=== Network Test Complete ===');
    return workingUrl;
  };