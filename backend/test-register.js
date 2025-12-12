const testRegister = async () => {
    try {
        console.log('Testing Registration...');
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'Test User',
                email: 'test' + Date.now() + '@example.com',
                password: 'password123',
                phoneNumber: '123456' + Math.floor(Math.random() * 1000)
            })
        });
        const data = await res.json();
        if (res.ok) {
            console.log('✅ Success:', data);
        } else {
            console.error('❌ Failed:', data);
        }
    } catch (err) {
        console.error('❌ Network/Server Error:', err.cause || err.message);
    }
};

testRegister();
