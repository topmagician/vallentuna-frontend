import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { ButtonPrimary } from '../button/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal(props: Props) {
  const supabaseUrl = 'https://lxstflrwscwaenzwsiwv.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4c3RmbHJ3c2N3YWVuendzaXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTExMzk4NzYsImV4cCI6MjAwNjcxNTg3Nn0.ieQl89Swq9w-VJ6gOYtXG2sjEyhXlImJprtHhJWjxMU';
  const supabaseClient = createClient(supabaseUrl, supabaseKey);

  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [role, setRole] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const saveProfile = async (name: string, role: boolean, title: string, department: string, address: string, phone: string, email: string) => {
    try {
      const { error } = await supabaseClient
        .from('vallentuna_users')
        .insert({
          name,
          role,
          title,
          department,
          address,
          phone,
          email
        });
        
      if (error) {
        console.error(error);
        return null;
      }

      return { name, role, title, department, address, phone, email };
      
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value === 'admin');
  };

  const handleSave = async () => {
    if (!name || !title || !department || !address || !phone || !email) {
      alert('All fields are required');
      return;
    }
    const savedContact = await saveProfile(name, role, title, department, address, phone, email);
    if (savedContact) {
      console.log('Contact saved successfully:', savedContact);
      window.location.reload();
    } else {
      console.error('Failed to save contact');
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="qrcode-modal"
      aria-describedby="qrcode"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle sx={{
        display: "flex",
        justifyContent: "space-between",
      }}>
        <IconButton
          aria-label='close'
          onClick={props.onClose}
        >
          <CancelIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{
          textAlign: "center"
        }}>
          <form noValidate autoComplete="on">
            <Grid container padding={3}>
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>Name:</Typography>
                  <TextField id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                </Stack>
              </Grid>
              {/* <Grid item xs={12} paddingBottom={1}>
                    <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                      <Typography>Role:</Typography>
                      <TextField id="title" label="Title" value={role} onChange={(e) => setRole(role)} />
                    </Stack>
                  </Grid> */}
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>Title:</Typography>
                  <TextField id="title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Stack>
              </Grid>
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>Department:</Typography>
                  <TextField id="department" label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </Stack>
              </Grid>
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>Address:</Typography>
                  <TextField id="address" label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </Stack>
              </Grid>
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>Phone Number:</Typography>
                  <TextField id="phone" label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Stack>
              </Grid>
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>Email:</Typography>
                  <TextField id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Stack>
              </Grid>
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>Role:</Typography>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={role ? 'admin' : 'manager'}
                    onChange={handleRoleChange}
                  >
                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                    <FormControlLabel value="manager" control={<Radio />} label="Manager" />
                  </RadioGroup>
                </Stack>
              </Grid>
            </Grid>
            <ButtonPrimary variant="contained" color="primary" onClick={handleSave}>
              Save
            </ButtonPrimary>
          </form>
        </Box>
      </DialogContent>
    </Dialog >
  );
}