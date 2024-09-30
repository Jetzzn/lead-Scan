import Airtable from 'airtable';

const AIRTABLE_API_KEY = 'patJOZPvbQAfRxOV2.1ae2fac8cd1c5ddc3dd99b4925785da3c204b926b4b77baaac0d6fd506254e89';
const AIRTABLE_BASE_ID = 'appVADkxTuwcN78c6';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
const USERS_TABLE_NAME = 'Approve Exhibitors';
const DOWNLOAD_DATA_TABLE_NAME = '🧑🏻‍🎓Visitors';
const DEVICE_LOGINS_TABLE_NAME = 'DeviceLogins';
const CORS_PROXY = 'http://localhost:8080/';
const columnMapping = {
  'Username': 'Username',
  'Institution name': 'Institution',
  'Booth': 'booth',

  // Add any other mappings here
};
const DEVICE_LIMIT = 2;
Airtable.configure({
  endpointUrl: CORS_PROXY + 'https://api.airtable.com',
  apiKey: AIRTABLE_API_KEY
});

// const base = Airtable.base(AIRTABLE_BASE_ID);
export const getUserCredentials = async (username, password) => {
  try {
    const records = await base(USERS_TABLE_NAME).select({
      filterByFormula: `AND({Username} = '${username}', {Password} = '${password}')`
    }).firstPage();

    if (records.length > 0) {
      return {
        username: records[0].get('Username'),
        // Add any other user data you want to return
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user credentials from Airtable:', error);
    throw error;
  }
};
export const addDeviceLogin = async (username, deviceId) => {
  try {
    const existingLogins = await getDeviceLogins(username);
    
    if (existingLogins.length >= DEVICE_LIMIT) {
      // Remove the oldest login
      const oldestLogin = existingLogins[0];
      await base(DEVICE_LOGINS_TABLE_NAME).destroy(oldestLogin.id);
    }
    
    const loginTime = new Date().toISOString();
    
    await base(DEVICE_LOGINS_TABLE_NAME).create({
      Username: username,
      DeviceId: deviceId,
      LoginTime: loginTime
    });

    console.log(`Device login added for ${username} with device ${deviceId}`);
  } catch (error) {
    console.error('Error adding device login:', error);
    throw error;
  }
};
export const removeDeviceLogin = async (username, deviceId) => {
  if (!username || !deviceId) {
    console.error('removeDeviceLogin: Missing username or deviceId');
    return;
  }

  try {
    const records = await base(DEVICE_LOGINS_TABLE_NAME).select({
      filterByFormula: `AND({Username} = '${username}', {DeviceId} = '${deviceId}')`
    }).all();

    for (let record of records) {
      await base(DEVICE_LOGINS_TABLE_NAME).destroy(record.id);
    }

    console.log(`Device login removed for ${username} with device ${deviceId}`);
  } catch (error) {
    console.error('Error removing device login:', error);
    throw error;
  }
};

export const getDeviceLogins = async (username) => {
  try {
    const records = await base(DEVICE_LOGINS_TABLE_NAME).select({
      filterByFormula: `{Username} = '${username}'`,
      sort: [{ field: 'LoginTime', direction: 'asc' }]
    }).all();
    
    return records.map(record => ({
      id: record.id,
      deviceId: record.get('DeviceId'),
      loginTime: record.get('LoginTime')
    }));
  } catch (error) {
    console.error('Error getting device logins:', error);
    throw error;
  }
};



export const checkDeviceLimit = async (username, deviceId) => {
  try {
    const existingLogins = await getDeviceLogins(username);
    
    // If this device is already logged in, it's allowed
    if (existingLogins.some(login => login.deviceId === deviceId)) {
      return true;
    }
    
    // Otherwise, check if we're at the limit
    return existingLogins.length < DEVICE_LIMIT;
  } catch (error) {
    console.error('Error checking device limit:', error);
    throw error;
  }
};



export const generateDeviceId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
export const getDownloadData = async () => {
  try {
    console.log(`Fetching download data from Airtable table: ${DOWNLOAD_DATA_TABLE_NAME}`);
    const records = await base(DOWNLOAD_DATA_TABLE_NAME).select().all();
    console.log(`Fetched ${records.length} data records`);
    return records.map(record => ({
      id: record.id,
      ...record.fields
    }));
  } catch (error) {
    console.error('Error fetching download data from Airtable:', error);
    throw error;
  }
};



// export const testAirtableConnection = async () => {
//   try {
//     const tableList = await base.table(DOWNLOAD_DATA_TABLE_NAME).select().firstPage();
//     console.log(`Successfully connected to Airtable. Found ${tableList.length} records in ${DOWNLOAD_DATA_TABLE_NAME}`);
//     return `Connection successful. Found ${tableList.length} records in ${DOWNLOAD_DATA_TABLE_NAME}`;
//   } catch (error) {
//     console.error('Airtable connection test failed:', error);
//     throw error;
//   }
// };
export const getUserProfile = async (username) => {
  try {
    console.log(`Fetching user profile for ${username}`);
    const records = await base(USERS_TABLE_NAME).select({
      filterByFormula: `{Username} = '${username}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length > 0) {
      const rawUserData = records[0].fields;
      const userData = {};

      Object.keys(columnMapping).forEach(airtableColumn => {
        const ourVariable = columnMapping[airtableColumn];
        userData[ourVariable] = rawUserData[airtableColumn];
      });

      console.log('User profile fetched successfully');
      return userData;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
export const getUserById = async (userId) => {
  try {
    console.log(`Fetching user data for ID: ${userId}`);
    const records = await base(DOWNLOAD_DATA_TABLE_NAME).select({
      filterByFormula: `{Unique ID} = '${userId}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length > 0) {
      const userData = records[0].fields;
      console.log('User data fetched successfully:', userData);
      return {
        id: userId,
        'First name': userData['First name'],
        'Last name': userData['Last name'],
        'Email': userData['Email'],
        'Phone Number': userData['Phone Number']
      };
    } else {
      console.log('No records found for this userId');
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
export const storeUserScanData = (username, user) => {
  const key = `userData_${username}`;
  const existingData = localStorage.getItem(key);
  const dataArray = existingData ? JSON.parse(existingData) : [];
  const scanTimestamp = new Date().toISOString();
  const userWithTimestamp = { ...user, scanTimestamp };
  dataArray.push(userWithTimestamp);
  localStorage.setItem(key, JSON.stringify(dataArray));
};


export const getUserScanData = (username) => {
  const key = `userData_${username}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};
export const clearUserScanData = (username) => {
  const key = `userData_${username}`;
  localStorage.removeItem(key);
};
export const storeScannedIds = (username, ids) => {
  const key = `scannedIds_${username}`;
  localStorage.setItem(key, JSON.stringify([...ids]));
};

export const getScannedIds = (username) => {
  const key = `scannedIds_${username}`;
  const ids = localStorage.getItem(key);
  return ids ? new Set(JSON.parse(ids)) : new Set();
};

export const clearUserData = (username) => {
  clearUserScanData(username);
  const scannedIdsKey = `scannedIds_${username}`;
  localStorage.removeItem(scannedIdsKey);
};