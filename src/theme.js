import { createMuiTheme } from '@material-ui/core/styles';
import { deepOrange, indigo, blue} from '@material-ui/core/colors';

export default createMuiTheme({
    palette: {
        primary: {
            light: deepOrange[200],
            main: blue[500],
            dark: deepOrange[900]
        },
        secondary: {
            light: indigo[200],
            main: indigo[500],
            dark: indigo[900]
        }
    }
})