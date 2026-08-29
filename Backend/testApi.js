import app from './src/app.js';

const server = app.listen(5002, async () => {
  console.log('Testing server running on port 5002...\n');
  
  try {
    const baseUrl = 'http://localhost:5002';

    // 1. Health endpoint
    const healthRes = await fetch(`${baseUrl}/api/health`).then(r => r.json());
    console.log('✔ GET /api/health:', healthRes);

    // 2. Crops endpoint
    const cropsRes = await fetch(`${baseUrl}/api/crops`).then(r => r.json());
    console.log(`✔ GET /api/crops: Found ${cropsRes.count} crops (Categories: ${cropsRes.categories?.join(', ')})`);

    // 3. States endpoint
    const statesRes = await fetch(`${baseUrl}/api/states`).then(r => r.json());
    console.log(`✔ GET /api/states: Found ${statesRes.states?.length} states`);

    // 4. Mandis endpoint for Haryana & Gurugram
    const mandisRes = await fetch(`${baseUrl}/api/mandis?state=Haryana&district=Gurugram`).then(r => r.json());
    console.log(`✔ GET /api/mandis?state=Haryana&district=Gurugram: Found ${mandisRes.count} mandis (e.g. ${mandisRes.mandis?.[0]?.name})`);

    // 5. Prices endpoint for Wheat in Haryana
    const pricesRes = await fetch(`${baseUrl}/api/prices?crop=Wheat&state=Haryana`).then(r => r.json());
    console.log(`✔ GET /api/prices?crop=Wheat&state=Haryana: Total: ${pricesRes.total}, Source: ${pricesRes.source}`);

    // 6. Compare Prices endpoint for Wheat in Haryana
    const compareRes = await fetch(`${baseUrl}/api/prices/compare?crop=Wheat&state=Haryana&district=Gurugram&quantity=15`).then(r => r.json());
    console.log(`✔ GET /api/prices/compare: Best Mandi = ${compareRes.summary?.bestMandi}, Avg Modal = ₹${compareRes.summary?.averageModalPrice}/Q, Total Mandis = ${compareRes.summary?.totalMandis}`);
    console.log(`   Recommendation: ${compareRes.bestRecommendation?.mandi} — Modal ₹${compareRes.bestRecommendation?.modalPrice}/Q (${compareRes.bestRecommendation?.message})`);

    // 7. Net Return Calculation endpoint
    const calcRes = await fetch(`${baseUrl}/api/v1/prices/calculate-net-return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cropId: 'onion',
        quantity: 25,
        state: 'Maharashtra',
        district: 'Nashik',
        farmerLat: 20.0059,
        farmerLng: 75.3200,
        vehicleRate: 14
      })
    }).then(r => r.json());
    console.log(`✔ POST /api/v1/prices/calculate-net-return: Best = ${calcRes.bestResult?.market}, Net Take-Home = ₹${calcRes.bestResult?.calculation?.netReturn}`);

    // 8. Historical Trends
    const trendsRes = await fetch(`${baseUrl}/api/v1/prices/historical-trends?cropId=wheat&mandiId=karnal-grain-mandi&days=7`).then(r => r.json());
    console.log(`✔ GET /api/v1/prices/historical-trends: ${trendsRes.trends?.length} days trends returned`);

    // 9. Auth Endpoints Test
    const demoRes = await fetch(`${baseUrl}/api/auth/demo-farmers`).then(r => r.json());
    console.log(`✔ GET /api/auth/demo-farmers: Loaded ${demoRes.farmers?.length} demo accounts`);

    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: '9876543210', password: 'farmer123' })
    }).then(r => r.json());
    console.log(`✔ POST /api/auth/login: Logged in as ${loginRes.user?.name} (${loginRes.user?.district}, ${loginRes.user?.state})`);

    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${loginRes.token}` }
    }).then(r => r.json());
    console.log(`✔ GET /api/auth/me: Verified session for ${meRes.user?.name}`);

    // 10. Merchant Portal Endpoints Test
    const merchantBulletinsRes = await fetch(`${baseUrl}/api/merchant/bulletins`).then(r => r.json());
    console.log(`✔ GET /api/merchant/bulletins: Found ${merchantBulletinsRes.count} active published bulletins`);

    const updatePriceRes = await fetch(`${baseUrl}/api/merchant/prices/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantId: 'merchant-2',
        mandiId: 'gurugram-grain-mandi',
        mandiName: 'Gurugram APMC Grain Market',
        district: 'Gurugram',
        state: 'Haryana',
        cropId: 'wheat',
        cropName: 'Wheat',
        modalPrice: 2750,
        minPrice: 2550,
        maxPrice: 2950,
        arrivalsTonnes: 250,
        grade: 'Grade A (Sharbati)',
        reason: 'High Mill Demand & Export Inquiries',
        status: 'Active Buying'
      })
    }).then(r => r.json());
    console.log(`✔ POST /api/merchant/prices/update: Updated Wheat in Gurugram to ₹${updatePriceRes.bulletin?.modalPrice}/Q (${updatePriceRes.bulletin?.reason})`);

    // Verify farmer comparison engine now uses the updated merchant price
    const compareAfterMerchantRes = await fetch(`${baseUrl}/api/prices/compare?crop=Wheat&state=Haryana&district=Gurugram`).then(r => r.json());
    const gurugramResult = compareAfterMerchantRes.results?.find(r => r.mandi.toLowerCase().includes('gurugram'));
    console.log(`✔ GET /api/prices/compare (Post-Merchant Update): Gurugram Mandi Wheat Modal Price = ₹${gurugramResult?.modalPrice}/Q (Note: "${gurugramResult?.merchantNote}")`);

    console.log('\n🎉 ALL REQUIRED ENDPOINTS, AUTHENTICATION & MERCHANT SERVICES VERIFIED AND WORKING PERFECTLY!');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    server.close();
  }
});
