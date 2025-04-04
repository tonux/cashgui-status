'use client';

import { useEffect, useState } from 'react';
import { Card, Title, Text } from '@tremor/react';

interface ServiceStatus {
  name: string;
  status: string;
  statusCode: number;
  lastChecked: string;
  responseTime?: number | null;
  error?: string;
}

const StatusBadge = ({ status, code }: { status: string; code: number }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return 'text-green-600';
      case 'DEGRADED_PERFORMANCE':
        return 'text-yellow-500';
      case 'MAJOR_OUTAGE':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`font-medium ${getStatusColor(status)}`}>
        {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
      </span>
      <span className="text-sm text-gray-500">
        (Status: {code})
      </span>
    </div>
  );
};

export default function Home() {
  const [data, setData] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }
        const data = await response.json();
        setData(data.services);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  const service = data[0]; // We only have one service now

  if (!service) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="mx-auto max-w-2xl">
        <Title>CashGUI Backoffice Status</Title>
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <Text>{service.name}</Text>
            <StatusBadge status={service.status} code={service.statusCode} />
          </div>
          {service.responseTime && (
            <Text className="mt-2 text-gray-500">
              Response time: {service.responseTime}ms
            </Text>
          )}
          {service.error && (
            <Text className="mt-2 text-red-500">
              Error: {service.error}
            </Text>
          )}
          <Text className="mt-2 text-gray-500">
            Last checked: {new Date(service.lastChecked).toLocaleString()}
          </Text>
        </div>
      </Card>
    </div>
  );
} 