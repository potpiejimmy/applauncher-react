import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBox';
import ReorderIcon from '@mui/icons-material/Reorder';
import CloudIcon from '@mui/icons-material/Cloud';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import InfoIcon from '@mui/icons-material/Info';
import FullScreenIcon from '@mui/icons-material/Fullscreen';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppService, AppContext } from './services/AppService';

import DummyComponent from './components/DummyComponent';

import './App.css';

const theme = createTheme({
    palette: {
      primary: { main: "#666" }
    },
});

class App extends AppService {

    componentDidMount() {
        this.load();
    }

    componentDidUpdate() {
        // update HTML background according to theme
        document.body.style.backgroundColor = this.darkMode ? "#111" : "#eee";
        this.save();
    }

    render() {

        return (
            <AppContext.Provider value={this}>
                <ThemeProvider theme={theme}>
                    <Box>
                        <AppBar position="static" sx={{ bgcolor: this.darkMode ? theme.palette.primary.dark : theme.palette.primary.light }}>
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
                                <IconButton size="small" color="inherit" aria-label="mode" onClick={()=>this.toggleMode()}>
                                    {this.state.mode == 'Auto' ? <BrightnessAutoIcon></BrightnessAutoIcon> :
                                        (this.state.mode == 'Dark' ? <DarkModeIcon></DarkModeIcon> : <LightModeIcon></LightModeIcon>)}
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
                        <DummyComponent></DummyComponent>
                    </main>
                </ThemeProvider>
            </AppContext.Provider>
        );
    }
}

export default App;
