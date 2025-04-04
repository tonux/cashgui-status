import axios from 'axios';
import { sendEmail, generateStatusEmail } from './email';

export interface ServiceCheck {
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'HEAD';
  expectedStatus?: number;
  timeout?: number;
}

const SERVICES: ServiceCheck[] = [
  {
    name: 'CashGUI Backoffice',
    endpoint: 'https://backoffice.cashgui.com',
    method: 'GET',
    expectedStatus: 200,
    timeout: 5000
  }
];

export async function checkService(service: ServiceCheck) {
  try {
    const response = await axios({
      method: service.method,
      url: service.endpoint,
      timeout: service.timeout || 5000,
      validateStatus: null
    });

    const isOperational = response.status === (service.expectedStatus || 200);
    
    // Send email notification if status is not 200
    if (!isOperational && process.env.ALERT_EMAIL) {
      const { subject, text, html } = generateStatusEmail(
        service.name,
        response.status
      );
      await sendEmail({
        to: process.env.ALERT_EMAIL,
        subject,
        text,
        html
      });
    }

    return {
      name: service.name,
      status: isOperational ? 'OPERATIONAL' : 'DEGRADED_PERFORMANCE',
      lastChecked: new Date(),
      responseTime: response.headers['x-response-time'] || null,
      statusCode: response.status
    };
  } catch (error: any) {
    // Send email notification for errors
    if (process.env.ALERT_EMAIL) {
      const { subject, text, html } = generateStatusEmail(
        service.name,
        error.response?.status || 0,
        error.message
      );
      await sendEmail({
        to: process.env.ALERT_EMAIL,
        subject,
        text,
        html
      });
    }

    return {
      name: service.name,
      status: 'MAJOR_OUTAGE',
      lastChecked: new Date(),
      error: error.message,
      statusCode: error.response?.status || 0
    };
  }
}

export async function checkAllServices() {
  return Promise.all(SERVICES.map(checkService));
} 