import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBox';
import ReorderIcon from '@mui/icons-material/Reorder';
import CloudIcon from '@mui/icons-material/Cloud';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import InfoIcon from '@mui/icons-material/Info';
import FullScreenIcon from '@mui/icons-material/Fullscreen';

import './App.css';

function App() {
  return (
    <div>

      <Box>
          <AppBar position="static">
              <Toolbar className="space-x-5">
                  <IconButton size="small" color="inherit" aria-label="add">
                      <AddIcon />
                  </IconButton>
                  <IconButton size="small" color="inherit" aria-label="order">
                      <ReorderIcon></ReorderIcon>
                  </IconButton>
                  <IconButton size="small" color="inherit" aria-label="cloud">
                      <CloudIcon></CloudIcon>
                  </IconButton>
                  <IconButton size="small" color="inherit" aria-label="mode">
                      <BrightnessAutoIcon></BrightnessAutoIcon>
                  </IconButton>
                  <IconButton size="small" color="inherit" aria-label="mode">
                      <InfoIcon></InfoIcon>
                  </IconButton>
                  <div className="grow"></div>
                  <Button color="inherit"><FullScreenIcon></FullScreenIcon>&nbsp;Full Screen</Button>
              </Toolbar>
          </AppBar>
      </Box>

      <main className="flex min-h-screen flex-row items-center justify-center p-4">
          <Button variant="outlined">Hello World</Button>
      </main>

    </div>
  );
}

export default App;
