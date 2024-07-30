import React from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const accounts = [
  { type: 'Owner', email: 'owner', password: 'owner' },
  { type: 'Staff', email: 'staff', password: 'staff' },
  { type: 'Customer', email: 'customer', password: 'customer' },
];

export default function NoteCard({ onCopy }) {
  return (
    <Card sx={{ position: 'fixed', top: 20, right: 20, width: 300, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Development Accounts</Typography>
        {accounts.map((account, index) => (
          <Grid container key={index} spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={8}>
              <Typography variant="body2">
                <strong>{account.type}:</strong><br />
                Email: {account.email}<br />
                Password: {account.password}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={() => onCopy(account)}
              >
                Copy
              </Button>
            </Grid>
          </Grid>
        ))}
      </CardContent>
    </Card>
  );
}