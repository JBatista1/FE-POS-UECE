/* eslint-disable react/prop-types */
import { Box, Icon, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useDrawerContext } from '../contexts';

interface ILayoutBaseDePaginaProps{
    children: React.ReactNode;
    titulo: string;
    barraDeFerramentas: React.ReactNode 

}
export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({children,titulo, barraDeFerramentas}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const {toggleDrawerOpen} = useDrawerContext();
  return(
    <Box height="100%" display={'flex'} flexDirection="column" gap={1}>
      <Box padding={1} display={'flex'} alignItems="center" height={theme.spacing(smDown? 6: mdDown ?8 : 12)} gap={1}>
        { smDown && 
        <IconButton onClick={toggleDrawerOpen}>
          <Icon className="material-symbols-outlined">
            Menu
          </Icon>
        </IconButton>}
        <Typography 
          variant={ smDown ? 'h5': mdDown ? 'h4' : 'h3'}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipses"
        >
          {titulo}
        </Typography>        
      </Box>

      {barraDeFerramentas &&
        <Box>
          {barraDeFerramentas}
        </Box>}

      <Box flex={1} overflow="auto">
        {children}
      </Box>
      
    </Box>
  );
};