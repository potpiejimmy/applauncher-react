import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import AddIcon from '@mui/icons-material/AddBox';
import ReorderIcon from '@mui/icons-material/Reorder';
import CloudIcon from '@mui/icons-material/Cloud';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import InfoIcon from '@mui/icons-material/Info';
import FullScreenIcon from '@mui/icons-material/Fullscreen';
import EditIcon from '@mui/icons-material/Edit';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import Snackbar from '@mui/material/Snackbar';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppService, AppContext } from './services/AppService';

import AddAppComponent from './components/AddAppComponent';
import DummyComponent from './components/DummyComponent';

import './App.css';

class App extends AppService {

    componentDidMount() {
        this.load();
        this.updateHtmlBackground();
    }

    componentDidUpdate() {
        this.updateHtmlBackground();
        this.save();
    }

    updateHtmlBackground() {
        // update HTML background according to theme
        document.body.style.backgroundColor = this.darkMode ? "#111" : "#eee";
    }

    render() {

        const theme = createTheme({
            palette: {
                mode: this.muiMode,
                primary: { main: "#888" }
            },
        });
        
        return (
            <AppContext.Provider value={this}>
                <ThemeProvider theme={theme}>

                    <div className="fixed z-10 right-4 top-20">
                        <ToggleButton value="editing" selected={this.state.editing} onChange={()=>this.toggleEditMode()} aria-label="editing">
                            <EditIcon></EditIcon>
                        </ToggleButton>
                    </div>

                    <main className="flex min-h-screen flex-col">

                        <Box>
                            <AppBar position="static">
                                <Toolbar className="space-x-5">
                                    <IconButton size="small" color="inherit" aria-label="add" onClick={event=>this.setState({anchorAdd: event.currentTarget})}>
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
                                    <Button color="inherit"><FullScreenIcon></FullScreenIcon><span className="hidden sm:inline">&nbsp;Full Screen</span></Button>
                                </Toolbar>
                            </AppBar>
                        </Box>

                        <div className="flex grow flex-row flex-wrap items-center justify-center content-center gap-5">

                            {this.state.currentApps.map((a:any) => 
                                <Card key={a.id} className="w-48 h-32" sx={{':hover': { boxShadow: theme.shadows[5] }}} onClick={()=>this.onAppClicked(a)}>
                                    {this.state.editing && <div className="z-10 absolute mx-2"><EditAttributesIcon></EditAttributesIcon></div>}
                                    <div className="h-full p-3 flex flex-col items-center justify-center gap-5">
                                        <img width="48" height="48" src={a.icon} onError={
                                            e=>e.currentTarget.src='./www.png'
                                        }/>
                                        <div className="w-full text-center whitespace-nowrap overflow-hidden">{a.name}</div>
                                    </div>
                                </Card>
                            )}
                        </div>

                        <Snackbar
                            open={this.state.snackbarOpen}
                            autoHideDuration={2000}
                            onClose={()=>this.setState({snackbarOpen: false})}
                            message={this.snackbarText}
                        />

                        <Popover
                            open={this.state.anchorAdd != null}
                            anchorEl={this.state.anchorAdd}
                            onClose={()=>this.setState({anchorAdd: null})}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}>
                            <AddAppComponent></AddAppComponent>
                        </Popover>  
                    </main>
                </ThemeProvider>
            </AppContext.Provider>
        );
    }
}

export default App;
