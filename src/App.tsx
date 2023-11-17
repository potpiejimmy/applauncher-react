import React from 'react';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';

import './App.css';

const AppCtx = React.createContext({});

const theme = createTheme({
    palette: {
      primary: { main: "#666" }
    },
});

function App() {

    const [ctx, setCtx] = React.useState({isPlatformDarkMode: false});

    const toggleTheme = () => {
        setCtx({isPlatformDarkMode: ctx.isPlatformDarkMode !== true});
    }

    return (
        <div>
            <AppCtx.Provider value={ctx}>
                <ThemeProvider theme={theme}>
                    <Box>
                        <AppBar position="static" sx={{ bgcolor: ctx.isPlatformDarkMode ? theme.palette.primary.dark : theme.palette.primary.light }}>
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
                                <IconButton size="small" color="inherit" aria-label="mode" onClick={toggleTheme}>
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
                </ThemeProvider>
            </AppCtx.Provider>
        </div>
    );
}

export default App;
