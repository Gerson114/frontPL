const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://teste.agenciaplanner.dev/';

exports.handler = async (event, context) => {
  const { httpMethod, body, queryStringParameters, headers } = event;
  
  try {
    if (httpMethod === 'POST') {
      const data = JSON.parse(body);
      const { path, ...requestData } = data;
      
      if (!path) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Path is required' })
        };
      }

      const apiUrl = `${BACKEND_URL}${path}`;
      console.log('POST to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        return {
          statusCode: response.status,
          body: JSON.stringify(responseData)
        };
      }

      // Handle login response with token
      if (path === '/login' && responseData.token) {
        return {
          statusCode: 200,
          headers: {
            'Set-Cookie': `token=${responseData.token}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/`
          },
          body: JSON.stringify({ success: true, message: responseData.message })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(responseData)
      };
    }
    
    if (httpMethod === 'GET') {
      const token = headers.cookie?.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
      
      if (!token) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'No token found' })
        };
      }

      const apiPath = queryStringParameters?.path || '';
      const query = queryStringParameters?.query || '';
      
      const apiUrl = `${BACKEND_URL}${apiPath}${query ? `?${query}` : ''}`;
      console.log('GET to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      return {
        statusCode: response.status,
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
    
  } catch (error) {
    console.error('Netlify Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};