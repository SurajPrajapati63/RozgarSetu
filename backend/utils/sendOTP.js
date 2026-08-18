import axios from 'axios';
import logger from './logger.js';

export const sendOTP = async (mobile, otp) => {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || authKey === 'your_msg91_key') {
    logger.info(`[DEV MOCK OTP] Mobile: ${mobile}, OTP: ${otp}`);
    return { success: true, mock: true };
  }

  try {
    const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${mobile}&otp=${otp}`;
    const response = await axios.post(url, {}, {
      headers: { authkey: authKey, 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    logger.error('MSG91 OTP Error:', error?.response?.data || error.message);
    // Fallback to dev log so development never crashes
    return { success: true, mock: true };
  }
};
