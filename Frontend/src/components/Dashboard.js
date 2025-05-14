import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState(['graphics', 'signage', 'printing']);

  const columns = [
    { field: 'company.name', headerName: 'Company', width: 200 },
    { field: 'event.name', headerName: 'Event', width: 200 },
    { 
      field: 'decision_makers',
      headerName: 'Decision Maker',
      width: 200,
      valueGetter: (params) => params.row.decision_makers[0]?.name || 'N/A'
    },
    { field: 'qualification_rationale', headerName: 'Qualification Rationale', width: 300 },
    { field: 'outreach_message', headerName: 'Outreach Message', width: 300 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleViewDetails(params.row)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const generateLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/leads/generate', {
        industry_keywords: keywords,
      });
      setLeads(response.data);
    } catch (error) {
      console.error('Error generating leads:', error);
    }
    setLoading(false);
  };

  const handleViewDetails = (lead) => {
    // Implement detailed view logic
    console.log('View details for lead:', lead);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          DuPont Tedlar Lead Generation Dashboard
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Industry Keywords"
                value={keywords.join(', ')}
                onChange={(e) => setKeywords(e.target.value.split(',').map(k => k.trim()))}
                helperText="Enter keywords separated by commas"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={generateLeads}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Leads'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={leads}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            disableSelectionOnClick
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 