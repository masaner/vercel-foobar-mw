// Mock data for demonstration purposes
const mockLeads = [
    { id: 1, name: 'John Doe', email: 'john@example.com', company: 'ABC Inc.' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', company: 'XYZ Corp' },
    // Add more mock leads as needed
  ];
  
  module.exports = (req, res) => {
    // const { count } = req.query;
    // const countString = typeof count === 'string' ? count : (Array.isArray(count) ? count[0] : '10');
    // const countNumber = parseInt(countString, 10);
  
    // // Generate random indices to select random leads
    // const randomIndices = generateRandomIndices(mockLeads.length, countNumber);
  
    // // Select random leads based on random indices
    // const randomLeads = randomIndices.map(index => mockLeads[index]);
  
    return res.json({
      leads: mockLeads,
    });
  };
  
  function generateRandomIndices(max, count) {
    const indices = [];
    while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    return indices;
  }
  