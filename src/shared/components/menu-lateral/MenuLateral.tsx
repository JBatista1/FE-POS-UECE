/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import { Avatar, Divider, Drawer, Icon, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import { Box } from '@mui/system';
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import { useAppThemeContext, useDrawerContext } from "../../contexts";

interface IListItemLinkProps{
    to: string;
    icon: string;
    label: string;
    onClick: (() => void) | undefined;
}
const ListItemLink: React.FC<IListItemLinkProps> = ({ to, icon, label, onClick }) =>{
  
  const navigate = useNavigate();  

  const handleClick = () => {
    navigate(to);
    onClick?.();
  };

  const resolvePath = useResolvedPath(to);
  const match = useMatch({ path: resolvePath.pathname, end: false});
  return(
    <ListItemButton selected={!!match} onClick={handleClick}>
      <ListItemIcon>
        <Icon className="material-symbols-outlined">{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};


interface IMenulateralProps{
    children: React.ReactNode
}
// eslint-disable-next-line react/prop-types
export const MenuLateral: React.FC<IMenulateralProps> = ({ children }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { isDrawerOpen, toggleDrawerOpen, drawerOptions} =useDrawerContext();
  const { toggleTheme } = useAppThemeContext();

  return(
    <>
      <Drawer open={isDrawerOpen} variant={smDown? 'temporary':'permanent'} onClose={toggleDrawerOpen}>
        <Box width={theme.spacing(28)} height="100%" display={"flex"} flexDirection={"column"} gap={1}>
          <Box width="100%" height={theme.spacing(20)} display="flex" alignItems="center" justifyContent="center">
            <Avatar
              sx={{ height: theme.spacing(12), width: theme.spacing(12) }}
              src="https://st3.depositphotos.com/5266903/14905/v/450/depositphotos_149052319-stock-illustration-businessman-rounded-grainy-icon.jpg"
            />
          </Box>
          <Divider />

          <Box flex={1}>
            <List component="nav">
              {drawerOptions.map( drawerOptions => (
                <ListItemLink
                  key={drawerOptions.to}
                  icon={drawerOptions.icon}
                  to={drawerOptions.to}
                  label={drawerOptions.label}
                  onClick={smDown ? toggleDrawerOpen : undefined }
                />
              ))}
            </List>            
          </Box>

          <Box >
            <List component="nav">
              <ListItemButton onClick={toggleTheme}>
                <ListItemIcon>
                  <Icon className="material-symbols-outlined">dark_mode</Icon>
                </ListItemIcon>
                <ListItemText primary="Alternar tema" />
              </ListItemButton>
            </List>           
          </Box>
        </Box>
        
      </Drawer>
      <Box height="100vh" marginLeft={smDown? 0 : theme.spacing(28)}>
        {children}
      </Box>
    </>
  );
};