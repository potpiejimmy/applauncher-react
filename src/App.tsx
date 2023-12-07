import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import AddIcon from '@mui/icons-material/AddBox';
import CloudIcon from '@mui/icons-material/Cloud';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import InfoIcon from '@mui/icons-material/Info';
import FullScreenIcon from '@mui/icons-material/Fullscreen';
import EditOnIcon from '@mui/icons-material/EditOutlined';
import EditOffIcon from '@mui/icons-material/EditOffOutlined';
import Snackbar from '@mui/material/Snackbar';
import Popover from '@mui/material/Popover';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from 'react-dnd'

import { AppService, AppContext } from './services/AppService';
import PwaLauncher from './components/PwaLauncher';

import AddAppComponent from './components/AddAppComponent';
import EditAppComponent from './components/EditAppComponent';
import CloudComponent from './components/CloudComponent';

import './App.css';

class App extends AppService {

    componentDidMount() {
        this.load();
    }

    info() {
        window.location.href='https://www.youtube.com/channel/UC6h8aqlVqboag4CJjZ9qCCw/about';
    }

    fullscreen() {
        window.location.href='https://youtube.com/redirect?q=applauncher.site';
    }

    render() {

        const theme = createTheme({
            palette: {
                mode: this.muiMode,
                primary: { main: "#888" }
            },
        });
        
        return (
            <DndProvider backend={TouchBackend}>
                <AppContext.Provider value={this}>
                    <ThemeProvider theme={theme}>

                        <div className="fixed z-10 right-4 top-20">
                            <ToggleButton value="editing" selected={this.state.editing} onChange={()=>this.toggleEditMode()} aria-label="editing">
                                {this.state.editing ? <EditOffIcon/> : <EditOnIcon/>}
                            </ToggleButton>
                        </div>

                        {this.state.currentFolder && 
                            <div className="fixed z-10 left-4 top-20">
                                <Button variant="outlined" onClick={()=>this.closeFolderImmediate()} aria-label="close folder">
                                    CLOSE {this.state.currentFolder.name}
                                </Button>
                            </div>
                        }
                        <main className="flex min-h-screen flex-col">

                            <Box>
                                <AppBar position="static">
                                    <Toolbar className="space-x-5">
                                        <IconButton size="small" color="inherit" aria-label="add" onClick={event=>this.setState({anchorAdd: event.currentTarget})}>
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton size="small" color="inherit" aria-label="cloud" onClick={event=>this.setState({anchorCloud: event.currentTarget})}>
                                            <CloudIcon></CloudIcon>
                                        </IconButton>
                                        <IconButton size="small" color="inherit" aria-label="mode" onClick={()=>this.toggleMode()}>
                                            {this.state.mode == 'Auto' ? <BrightnessAutoIcon></BrightnessAutoIcon> :
                                                (this.state.mode == 'Dark' ? <DarkModeIcon></DarkModeIcon> : <LightModeIcon></LightModeIcon>)}
                                        </IconButton>
                                        <IconButton size="small" color="inherit" aria-label="info" onClick={()=>this.info()}>
                                            <InfoIcon></InfoIcon>
                                        </IconButton>
                                        <div className="grow"/>
                                        <Button color="inherit" onClick={()=>this.fullscreen()}><FullScreenIcon></FullScreenIcon><span className="hidden sm:inline">&nbsp;Full Screen</span></Button>
                                    </Toolbar>
                                </AppBar>
                            </Box>

                            <div className="flex grow flex-row flex-wrap items-center justify-center content-center gap-5">

                                {this.state.currentApps.map((a:any) =>
                                    <div key={a.id}>
                                        <PwaLauncher pwa={a}/>
                                    </div>
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
                                <AddAppComponent/>
                            </Popover>

                            <Popover
                                open={this.state.anchorCloud != null}
                                anchorEl={this.state.anchorCloud}
                                onClose={()=>this.setState({anchorCloud: null})}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}>
                                <CloudComponent/>
                            </Popover>

                            <EditAppComponent/>

                        </main>
                    </ThemeProvider>
                </AppContext.Provider>
            </DndProvider>
        );
    }
}

export default App;
