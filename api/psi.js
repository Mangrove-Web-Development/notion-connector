import fetch from 'node-fetch';

async function getReport(url, device) {
  const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  const parameters = {
    url: encodeURIComponent(url),
    strategy: device,
  };

  let query = `${api}?`;

	query += `url=${parameters.url}&`;
	query += `strategy=${parameters.strategy}&`;

  // Add API key to query
  query += `&key=${process.env.PSI_API_KEY}`;

  // Fetch the report
  const response = await fetch(query);

  try {
    return response.json();
  } catch (error) {
    console.error(error);
    const errorBody = await error.response.text();
    console.error(`Error body: ${errorBody}`);
  }
}

export default getReport;
