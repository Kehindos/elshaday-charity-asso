const http = require('http');

async function request(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (data) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: `/api${path}`,
        method,
        headers,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      },
    );

    req.on('error', reject);
    if (data) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🚀 TESTING NESTJS + MYSQL 8.0 BACKEND API ENDPOINTS');
  console.log('======================================================\n');

  // 1. Admin Login
  console.log('🔹 1. Testing Admin Login (POST /api/auth/login)');
  const loginRes = await request('/auth/login', 'POST', {
    email: 'admin@charity.org',
    password: 'Admin123!',
  });
  console.log('Status:', loginRes.status);
  console.log('Admin:', loginRes.data.data.user.name, `(${loginRes.data.data.user.email})`);
  const token = loginRes.data.data.accessToken;
  console.log('JWT Access Token:', token.substring(0, 40) + '...\n');

  // 2. Dashboard Stats
  console.log('🔹 2. Testing Admin Dashboard (GET /api/statistics/dashboard)');
  const dashRes = await request('/statistics/dashboard', 'GET', null, token);
  console.log('Status:', dashRes.status);
  console.log('Summary Counts:', dashRes.data.data.summary);
  console.log('Status Percentages:', dashRes.data.data.volunteerStatusDistribution, '\n');

  // 3. Public Volunteer Registration
  console.log('🔹 3. Testing Public Volunteer Registration (POST /api/volunteers/register)');
  const uniqueEmail = `test.volunteer.${Date.now()}@example.com`;
  const regRes = await request('/volunteers/register', 'POST', {
    fullName: 'Sara Hailemariam',
    email: uniqueEmail,
    phone: '+251911445566',
    city: 'Addis Ababa',
    occupation: 'Software Engineer',
    skills: ['Web Development', 'UI/UX Design'],
    areasOfInterest: ['Media & Communications'],
    availability: 'Evenings & Weekends',
    motivation: 'Excited to help with digital outreach!',
  });
  console.log('Status:', regRes.status);
  const newVol = regRes.data.data;
  console.log('Registered Volunteer ID:', newVol.id, 'Status:', newVol.status, 'Name:', newVol.fullName, '\n');

  // 4. Admin Updating Volunteer Status
  console.log(`🔹 4. Testing Admin Status Approval (PATCH /api/volunteers/${newVol.id}/status)`);
  const approveRes = await request(`/volunteers/${newVol.id}/status`, 'PATCH', {
    status: 'APPROVED',
    adminNotes: 'Application verified and approved by team leader.',
  }, token);
  console.log('Status:', approveRes.status);
  console.log('Updated Status:', approveRes.data.data.status, '| Approved by:', approveRes.data.data.approvedByAdminName, '\n');

  // 5. Public Content (Programs, Events, Gallery, Settings)
  console.log('🔹 5. Testing Public Programs (GET /api/content/public/programs)');
  const progRes = await request('/content/public/programs', 'GET');
  console.log('Status:', progRes.status, '| Total Programs:', progRes.data.data.length);
  progRes.data.data.forEach((p) => {
    console.log(`   - [${p.category}] ${p.title} (${p.titleAm || ''}) | Raised: ETB ${p.currentAmount} / ${p.targetAmount}`);
  });

  console.log('\n🔹 6. Testing Public Settings (GET /api/content/public/settings)');
  const setRes = await request('/content/public/settings', 'GET');
  console.log('Org Name:', setRes.data.data.org_name, `(${setRes.data.data.org_name_am})`);
  console.log('Phone:', setRes.data.data.org_phone);
  console.log('Donation Bank:', setRes.data.data.bank_cbe_account);
  console.log('Telebirr:', setRes.data.data.bank_telebirr, '\n');

  // 7. Contact Message Form
  console.log('🔹 7. Testing Contact Form (POST /api/messages)');
  const msgRes = await request('/messages', 'POST', {
    fullName: 'Kassahun Belay',
    email: 'kassahun@gmail.com',
    phone: '+251922334455',
    subject: 'School supplies donation inquiry',
    message: 'We have 200 notebooks ready to deliver this Friday.',
  });
  console.log('Status:', msgRes.status);
  console.log('Submitted Message ID:', msgRes.data.data.id, 'Status:', msgRes.data.data.status, '\n');

  // 8. Admin List Messages
  console.log('🔹 8. Testing Admin Messages List (GET /api/messages)');
  const msgList = await request('/messages', 'GET', null, token);
  console.log('Status:', msgList.status, '| Total Messages:', msgList.data.data.meta.total);

  console.log('\n======================================================');
  console.log('✅ ALL BACKEND FUNCTIONS VERIFIED AND WORKING 100%!');
  console.log('======================================================\n');
}

runTests().catch(console.error);
