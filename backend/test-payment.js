const testPayment = async () => {
    try {
        console.log('--- Starting Payment Test ---');

        // 1. Pay Bill / QR (Simpler, no receiver needed)
        console.log('1. Testing /pay endpoint (QR/Bill)...');
        const payRes = await fetch('http://localhost:5000/api/transactions/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 50,
                merchant: 'Starbucks Test',
                category: 'Food'
            })
        });
        const payData = await payRes.json();
        if (payRes.ok) {
            console.log('✅ Pay Success:', payData);
        } else {
            console.error('❌ Pay Failed:', payData);
        }

        // 2. Transfer to UPI (Bypasses internal account lookup)
        console.log('\n2. Testing /transfer endpoint (UPI)...');
        const transferRes = await fetch('http://localhost:5000/api/transactions/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                toAccountNumber: 'UPI-TEST-123',
                amount: 25,
                category: 'Transfer',
                note: 'Test External Transfer' // Fixed: was 'description' in old script
            })
        });
        const transferData = await transferRes.json();
        if (transferRes.ok) {
            console.log('✅ Transfer Success:', transferData);
        } else {
            console.error('❌ Transfer Failed:', transferData);
        }

    } catch (err) {
        console.error('❌ Script Error:', err.cause || err.message);
    }
};

testPayment();
