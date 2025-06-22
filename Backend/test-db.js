const mongoose = require('mongoose');
const User = require('./models/User');

async function testDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb+srv://afterink:afterink123@cluster0.mongodb.net/afterink-dashboard?retryWrites=true&w=majority');
    console.log('✅ Connected to MongoDB');

    console.log('👥 Finding all users...');
    const allUsers = await User.find({});
    console.log(`Found ${allUsers.length} users:`);
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.role}): ${user._id}`);
    });

    console.log('\n🔍 Finding founding members...');
    const foundingMembers = await User.find({ role: 'founding_member' });
    console.log(`Found ${foundingMembers.length} founding members:`);
    foundingMembers.forEach(user => {
      console.log(`- ${user.name}: ${user._id}`);
    });

    if (foundingMembers.length > 0) {
      const testUserId = foundingMembers[0]._id;
      console.log(`\n🧪 Testing user lookup with ID: ${testUserId}`);
      
      const foundUser = await User.findById(testUserId);
      if (foundUser) {
        console.log(`✅ User found: ${foundUser.name} (${foundUser.role})`);
      } else {
        console.log('❌ User not found');
      }
    }

    console.log('\n✅ Database test completed');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testDatabase(); 