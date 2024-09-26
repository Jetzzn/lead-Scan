import Airtable from 'airtable';

const AIRTABLE_API_KEY = 'patJOZPvbQAfRxOV2.1ae2fac8cd1c5ddc3dd99b4925785da3c204b926b4b77baaac0d6fd506254e89';
const AIRTABLE_BASE_ID = 'appVADkxTuwcN78c6';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
const USERS_TABLE_NAME = 'Approve Exhibitors';
const DOWNLOAD_DATA_TABLE_NAME = '🧑🏻‍🎓Visitors';
const CORS_PROXY = 'http://localhost:8080/';
const columnMapping = {
  'Username': 'Username',
  'Institution name': 'Institution',
  'Booth': 'booth',

  // Add any other mappings here
};
Airtable.configure({
  endpointUrl: CORS_PROXY + 'https://api.airtable.com',
  apiKey: AIRTABLE_API_KEY
});

// const base = Airtable.base(AIRTABLE_BASE_ID);
export const getUserCredentials = async () => {
  try {
    console.log(`Fetching user credentials from Airtable table: ${USERS_TABLE_NAME}`);
    const records = await base(USERS_TABLE_NAME).select({
      fields: ['Username', 'Password']
    }).all();
    console.log(`Fetched ${records.length} user records`);
    return records.map(record => ({
      username: record.get('Username'),
      password: record.get('Password'),
     
    }));
  } catch (error) {
    console.error('Error fetching user credentials from Airtable:', error);
    throw error;
  }
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

// export const addLead = async (leadData) => {
//   try {
//     console.log('Adding new lead to Airtable');
//     const result = await base('Leads').create([{ fields: leadData }]);
//     console.log('Lead added successfully:', result);
//     return result[0];
//   } catch (error) {
//     console.error('Error adding lead to Airtable:', error);
//     throw error;
//   }
// };

// export const getAllLeads = async () => {
//   try {
//     console.log('Fetching all leads from Airtable');
//     const records = await base('Leads').select().all();
//     console.log(`Fetched ${records.length} lead records`);
//     return records.map(record => ({
//       id: record.id,
//       ...record.fields
//     }));
//   } catch (error) {
//     console.error('Error fetching leads from Airtable:', error);
//     throw error;
//   }
// };

export const testAirtableConnection = async () => {
  try {
    const tableList = await base.table(DOWNLOAD_DATA_TABLE_NAME).select().firstPage();
    console.log(`Successfully connected to Airtable. Found ${tableList.length} records in ${DOWNLOAD_DATA_TABLE_NAME}`);
    return `Connection successful. Found ${tableList.length} records in ${DOWNLOAD_DATA_TABLE_NAME}`;
  } catch (error) {
    console.error('Airtable connection test failed:', error);
    throw error;
  }
};
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

      // Map the Airtable column names to our desired variable names
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

    console.log('Fetched records:', records); 

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
export const storeUserScanData = (username, scanData) => {
  const key = `scanData_${username}`;
  const existingData = localStorage.getItem(key);
  const dataArray = existingData ? JSON.parse(existingData) : [];
  dataArray.push(scanData);
  localStorage.setItem(key, JSON.stringify(dataArray));
};

export const getUserScanData = (username) => {
  const key = `scanData_${username}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const clearUserScanData = (username) => {
  const key = `scanData_${username}`;
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

export const clearScannedIds = (username) => {
  const key = `scannedIds_${username}`;
  localStorage.removeItem(key);
};