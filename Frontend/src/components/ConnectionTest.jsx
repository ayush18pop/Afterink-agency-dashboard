import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';

export default function ConnectionTest() {
  const [testResult, setTestResult] = useState(null);
  const [healthResult, setHealthResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧪 Testing backend connection...');
      
      // Test basic connection
      const testResponse = await axios.get('/api/test');
      setTestResult(testResponse.data);
      console.log('✅ Test route response:', testResponse.data);
      
      // Test health check
      const healthResponse = await axios.get('/api/health');
      setHealthResult(healthResponse.data);
      console.log('✅ Health check response:', healthResponse.data);
      
    } catch (err) {
      console.error('❌ Connection test failed:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          withCredentials: err.config?.withCredentials
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🔧 Backend Connection Test</h2>
      
      <button 
        onClick={testConnection}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">❌ Connection Error</h3>
          <p><strong>Message:</strong> {error.message}</p>
          <p><strong>Status:</strong> {error.status}</p>
          <p><strong>URL:</strong> {error.config?.url}</p>
          <p><strong>Method:</strong> {error.config?.method}</p>
          <p><strong>With Credentials:</strong> {error.config?.withCredentials ? 'Yes' : 'No'}</p>
          {error.data && (
            <pre className="mt-2 text-sm bg-red-50 p-2 rounded">
              {JSON.stringify(error.data, null, 2)}
            </pre>
          )}
        </div>
      )}

      {testResult && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="font-bold">✅ Test Route Response</h3>
          <pre className="mt-2 text-sm bg-green-50 p-2 rounded">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      {healthResult && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          <h3 className="font-bold">🏥 Health Check Response</h3>
          <pre className="mt-2 text-sm bg-blue-50 p-2 rounded">
            {JSON.stringify(healthResult, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold text-gray-800">🔍 Debug Information</h3>
        <p><strong>Frontend URL:</strong> {window.location.origin}</p>
        <p><strong>Backend URL:</strong> {process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://afterink-agency-dashboard-backend.onrender.com"}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>Cookies Enabled:</strong> {navigator.cookieEnabled ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
} 