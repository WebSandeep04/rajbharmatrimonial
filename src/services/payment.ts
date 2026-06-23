import api from './api';

export const createPaymentOrder = async (amount: number, description: string = 'Premium Membership') => {
  try {
    const response = await api.post('/payment/create-order', { amount, description });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyPaymentSignature = async (paymentDetails: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  try {
    const response = await api.post('/payment/verify', paymentDetails);
    return response.data;
  } catch (error) {
    throw error;
  }
};
