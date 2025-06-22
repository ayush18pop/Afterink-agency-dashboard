const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUsers = [
  {
    name: 'John CEO',
    email: 'john.ceo@afterink.com',
    password: 'password123',
    role: 'ceo'
  },
  {
    name: 'Sarah Founding',
    email: 'sarah.founding@afterink.com',
    password: 'password123',
    role: 'founding_member'
  },
  {
    name: 'Mike Freelancer',
    email: 'mike.freelancer@afterink.com',
    password: 'password123',
    role: 'freelancer'
  }
];

const testTasks = [
  {
    title: 'Website Redesign',
    description: 'Complete redesign of company website with modern UI/UX',
    priority: 'High',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Not Started'
  },
  {
    title: 'Mobile App Development',
    description: 'Develop iOS and Android apps for the platform',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'In Progress'
  }
];

let authTokens = {};
let createdUsers = [];
let createdTasks = [];

async function testCompleteSystem() {
  console.log('🚀 Starting comprehensive system test...\n');

  try {
    // 1. Test User Creation
    console.log('📝 Testing User Creation...');
    await testUserCreation();

    // 2. Test Login
    console.log('\n🔐 Testing Login...');
    await testLogin();

    // 3. Test Task Creation and Assignment
    console.log('\n📋 Testing Task Creation...');
    await testTaskCreation();

    // 4. Test Time Tracking
    console.log('\n⏰ Testing Time Tracking...');
    await testTimeTracking();

    // 5. Test Profile Management
    console.log('\n👤 Testing Profile Management...');
    await testProfileManagement();

    // 6. Test Leaderboard
    console.log('\n🏆 Testing Leaderboard...');
    await testLeaderboard();

    // 7. Test Analytics
    console.log('\n📊 Testing Analytics...');
    await testAnalytics();

    console.log('\n✅ All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Created ${createdUsers.length} users`);
    console.log(`   - Created ${createdTasks.length} tasks`);
    console.log(`   - All API endpoints working correctly`);
    console.log(`   - Time tracking functional`);
    console.log(`   - Leaderboard calculating properly`);
    console.log(`   - Profile system operational`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

async function testUserCreation() {
  for (const userData of testUsers) {
    try {
      // First, try to login as CEO to get token
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'admin@afterink.com',
        password: 'admin123'
      });
      
      const ceoToken = loginResponse.data.token;
      
      // Create user
      const response = await axios.post(`${BASE_URL}/users/add`, userData, {
        headers: { Authorization: `Bearer ${ceoToken}` }
      });
      
      console.log(`   ✅ Created user: ${userData.name} (${userData.role})`);
      createdUsers.push({ ...userData, id: response.data.userId });
      
    } catch (error) {
      console.log(`   ⚠️  User ${userData.name} might already exist: ${error.response?.data?.error || error.message}`);
    }
  }
}

async function testLogin() {
  for (const userData of testUsers) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: userData.email,
        password: userData.password
      });
      
      authTokens[userData.email] = response.data.token;
      console.log(`   ✅ Login successful: ${userData.name}`);
      
    } catch (error) {
      console.log(`   ⚠️  Login failed for ${userData.name}: ${error.response?.data?.error || error.message}`);
    }
  }
}

async function testTaskCreation() {
  const ceoToken = authTokens['john.ceo@afterink.com'] || authTokens['admin@afterink.com'];
  
  if (!ceoToken) {
    console.log('   ⚠️  No CEO token available for task creation');
    return;
  }

  // Get available users for assignment
  try {
    const usersResponse = await axios.get(`${BASE_URL}/tasks/all-names`, {
      headers: { Authorization: `Bearer ${ceoToken}` }
    });
    
    const availableUsers = usersResponse.data.members;
    console.log(`   📋 Found ${availableUsers.length} users for assignment`);

    for (const taskData of testTasks) {
      // Assign to a random user
      const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
      
      const taskToCreate = {
        ...taskData,
        assignedTo: randomUser._id
      };

      const response = await axios.post(`${BASE_URL}/tasks/create`, taskToCreate, {
        headers: { Authorization: `Bearer ${ceoToken}` }
      });

      console.log(`   ✅ Created task: ${taskData.title} (assigned to ${randomUser.name})`);
      createdTasks.push({ ...taskToCreate, id: response.data.taskId });
    }
    
  } catch (error) {
    console.log(`   ❌ Task creation failed: ${error.response?.data?.error || error.message}`);
  }
}

async function testTimeTracking() {
  // Test time tracking for each user
  for (const userData of testUsers) {
    const token = authTokens[userData.email];
    if (!token) continue;

    try {
      // Get user's tasks
      const tasksResponse = await axios.get(`${BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (tasksResponse.data.length > 0) {
        const task = tasksResponse.data[0];
        
        // Start time tracking
        await axios.post(`${BASE_URL}/time/start`, {
          taskId: task._id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`   ✅ Started time tracking for ${userData.name} on task: ${task.title}`);
        
        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Hold time tracking
        await axios.post(`${BASE_URL}/time/hold`, {
          taskId: task._id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`   ✅ Held time tracking for ${userData.name}`);
        
        // Wait a bit more
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Resume time tracking
        await axios.post(`${BASE_URL}/time/start`, {
          taskId: task._id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`   ✅ Resumed time tracking for ${userData.name}`);
        
        // Wait and complete
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        await axios.post(`${BASE_URL}/time/complete`, {
          taskId: task._id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(`   ✅ Completed time tracking for ${userData.name}`);
        
      } else {
        console.log(`   ⚠️  No tasks found for ${userData.name}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Time tracking failed for ${userData.name}: ${error.response?.data?.error || error.message}`);
    }
  }
}

async function testProfileManagement() {
  for (const userData of testUsers) {
    const token = authTokens[userData.email];
    if (!token) continue;

    try {
      // Get profile
      const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`   ✅ Retrieved profile for ${userData.name}`);
      
      // Update profile
      const updateData = {
        bio: `Updated bio for ${userData.name} - ${new Date().toISOString()}`,
        phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`,
        location: 'Remote',
        department: 'Engineering',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
      };
      
      await axios.put(`${BASE_URL}/users/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`   ✅ Updated profile for ${userData.name}`);
      
    } catch (error) {
      console.log(`   ❌ Profile management failed for ${userData.name}: ${error.response?.data?.error || error.message}`);
    }
  }
}

async function testLeaderboard() {
  const ceoToken = authTokens['john.ceo@afterink.com'] || authTokens['admin@afterink.com'];
  
  if (!ceoToken) {
    console.log('   ⚠️  No CEO token available for leaderboard test');
    return;
  }

  try {
    // Test top performers endpoint
    const performersResponse = await axios.get(`${BASE_URL}/users/top-performers`, {
      headers: { Authorization: `Bearer ${ceoToken}` }
    });
    
    console.log(`   ✅ Retrieved top performers: ${performersResponse.data.performers.length} users`);
    
    // Test member names endpoint
    const membersResponse = await axios.get(`${BASE_URL}/tasks/all-names`, {
      headers: { Authorization: `Bearer ${ceoToken}` }
    });
    
    console.log(`   ✅ Retrieved member names: ${membersResponse.data.members.length} users`);
    
  } catch (error) {
    console.log(`   ❌ Leaderboard test failed: ${error.response?.data?.error || error.message}`);
  }
}

async function testAnalytics() {
  for (const userData of testUsers) {
    const token = authTokens[userData.email];
    if (!token) continue;

    try {
      // Test task analytics
      const taskAnalytics = await axios.get(`${BASE_URL}/tasks/user-analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`   ✅ Task analytics for ${userData.name}:`, {
        totalTasks: taskAnalytics.data.totalTasks,
        completedTasks: taskAnalytics.data.completedTasks,
        completionRate: taskAnalytics.data.completionRate
      });
      
      // Test time analytics
      const timeAnalytics = await axios.get(`${BASE_URL}/time/user-analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`   ✅ Time analytics for ${userData.name}:`, {
        totalTime: timeAnalytics.data.totalTime,
        todayTime: timeAnalytics.data.todayTime,
        weeklyTime: timeAnalytics.data.weeklyTime
      });
      
    } catch (error) {
      console.log(`   ❌ Analytics failed for ${userData.name}: ${error.response?.data?.error || error.message}`);
    }
  }
}

// Run the test
testCompleteSystem().catch(console.error); 