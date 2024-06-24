/* eslint-disable react/prop-types */
import { Box, Button, Icon, Paper, TextField, useTheme } from '@mui/material';

interface IBarraDeFerramentasprops{
  textoDaBusca?: string;
  mostrarInputBusca?: boolean;
  aoMudarTextDeBusca?: (novoTexto: string) => void;
  textoBotaoNovo?: string;
  mostrarBotaoNovo?: boolean;
  aoClicaremNovo?: () => void;
}
export const FerramentasDeListagem: React.FC<IBarraDeFerramentasprops> = ({
  textoDaBusca = '',
  mostrarInputBusca = false,
  aoMudarTextDeBusca,
  textoBotaoNovo = 'Novo',
  mostrarBotaoNovo = true,
  aoClicaremNovo,
}) => {
  const theme = useTheme();

  return(
    <Box 
      height={theme.spacing(5)}
      marginX={1}
      padding={1}
      paddingX={2}
      display="flex"
      gap={1}
      alignItems="center"
      component={Paper}
    >
      { mostrarInputBusca &&
        <TextField 
          value={textoDaBusca}
          onChange={(e) => aoMudarTextDeBusca?.(e.target.value)}
          size="small"
          placeholder="Pesquisar..."
        />}  
      <Box flex={1} display="flex" justifyContent="end">
        {mostrarBotaoNovo && (
          <Button 
            color='primary'
            disableElevation
            endIcon={<Icon className="material-symbols-outlined">
              add
            </Icon>}
            variant='contained'
            onClick={aoClicaremNovo}
          >{textoBotaoNovo}</Button> 
        )}
      </Box>
        
    </Box>
  );
};