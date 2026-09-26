const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = body;
        }
        resolve({ status: res.statusCode, body: parsed, headers: res.headers });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Step 8 Smoke Tests ---');
  const timestamp = Date.now();
  const user1Email = `user1_${timestamp}@example.com`;
  const user2Email = `user2_${timestamp}@example.com`;

  // Test 1: POST /api/auth/register -> returns token + user
  const regRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { name: 'Alice', email: user1Email, password: 'password123' });

  console.log('Test 1 - Register:', regRes.status === 201 && regRes.body.token ? 'PASS' : 'FAIL', regRes.status);
  const user1Token = regRes.body.token;

  // Test 2: POST /api/auth/login -> returns token
  const loginRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { email: user1Email, password: 'password123' });
  console.log('Test 2 - Login:', loginRes.status === 200 && loginRes.body.token ? 'PASS' : 'FAIL', loginRes.status);

  // Test 3: GET /api/auth/me with Authorization: Bearer <token> -> returns user
  const meRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${user1Token}` },
  });
  console.log('Test 3 - GET /api/auth/me:', meRes.status === 200 && meRes.body.email === user1Email ? 'PASS' : 'FAIL', meRes.status);

  // Test 4: POST /api/bills with token -> creates bill
  const createBillRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/bills',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user1Token}`,
    },
  }, { title: 'Dinner with Friends', description: 'Italian Restaurant Friday' });
  console.log('Test 4 - POST /api/bills:', createBillRes.status === 201 && createBillRes.body._id ? 'PASS' : 'FAIL', createBillRes.status);
  const billId = createBillRes.body._id;

  // Test 5: GET /api/bills with token -> returns that bill only
  const getBillsRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/bills',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${user1Token}` },
  });
  const hasBill = Array.isArray(getBillsRes.body) && getBillsRes.body.some(b => b._id === billId && b.itemCount === 0);
  console.log('Test 5 - GET /api/bills:', getBillsRes.status === 200 && hasBill ? 'PASS' : 'FAIL', getBillsRes.status);

  // Test 6: POST /api/bills/:id/items -> adds an item
  const addItemRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: `/api/bills/${billId}/items`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user1Token}`,
    },
  }, { name: 'Pizza Margherita', quantity: 2 });
  console.log('Test 6 - POST /api/bills/:id/items:', addItemRes.status === 201 && addItemRes.body._id ? 'PASS' : 'FAIL', addItemRes.status);
  const itemId = addItemRes.body._id;

  // Test 7: PUT /api/bills/:id/items/:itemId -> toggles purchased
  const toggleItemRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: `/api/bills/${billId}/items/${itemId}`,
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${user1Token}` },
  });
  console.log('Test 7 - PUT /api/bills/:id/items/:itemId:', toggleItemRes.status === 200 && toggleItemRes.body.purchased === true ? 'PASS' : 'FAIL', toggleItemRes.status);

  // Test 8: DELETE /api/bills/:id/items/:itemId -> removes item
  const deleteItemRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: `/api/bills/${billId}/items/${itemId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${user1Token}` },
  });
  console.log('Test 8 - DELETE /api/bills/:id/items/:itemId:', deleteItemRes.status === 200 ? 'PASS' : 'FAIL', deleteItemRes.status);

  // Test 10: Negative test: with a second user's token, GET /api/bills/:billId -> must return 404
  const regUser2 = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { name: 'Bob', email: user2Email, password: 'password123' });
  const user2Token = regUser2.body.token;

  const negativeRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: `/api/bills/${billId}`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${user2Token}` },
  });
  console.log('Test 10 - Negative Test (Other user access):', negativeRes.status === 404 ? 'PASS' : 'FAIL', negativeRes.status);

  // Test 9: DELETE /api/bills/:id -> removes bill
  const deleteBillRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: `/api/bills/${billId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${user1Token}` },
  });
  console.log('Test 9 - DELETE /api/bills/:id:', deleteBillRes.status === 200 ? 'PASS' : 'FAIL', deleteBillRes.status);

  console.log('--- Completed All 10 Smoke Tests ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Smoke tests error:', err);
  process.exit(1);
});
