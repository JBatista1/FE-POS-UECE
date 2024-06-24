import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ContasService, IListagemConta, IPagamentoContaConta } from '../../shared/services/api/contas/contasServices';
import { FerramentasDeListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { useDebounce } from '../../shared/hooks';
import { Environment } from '../../shared/environment';
import { format } from 'date-fns';


export const ListagemDeContas: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  

  const [rows, setRows] = useState<IListagemConta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);


  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);


  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      ContasService.getAll()
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            console.log(result);

            setTotalCount(result.totalCount);
            setRows(result.data);
          }
        });
    });
  }, [busca, pagina]);

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      ContasService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.id !== id),
            ]);
            alert('Registro apagado com sucesso!');
          }
        });
    }
  };

  const handleUpdatePagamento = (id: number) => {
    if (confirm('Deseja realizar pagamento?')) {
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      const pagamento: IPagamentoContaConta = { dataPagamento: formattedDate };
      ContasService.atualizarPagamento(id, pagamento)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            
            alert('Registro pago com sucesso!');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo='Listagem de Contas'
      barraDeFerramentas={
        <FerramentasDeListagem
          mostrarInputBusca
          textoDaBusca={busca}
          textoBotaoNovo='Nova'
          aoClicaremNovo={() => navigate('/contas/detalhe/nova')}
          aoMudarTextDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={100}>Ações</TableCell>
              <TableCell>id</TableCell>
              <TableCell>Cpf</TableCell>
              <TableCell>Titulo</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>valor Atualizado Com Juros</TableCell>
              <TableCell>Data vencimento</TableCell>
              <TableCell>Conta atrasada</TableCell>
              <TableCell>Taxa de juros por dia</TableCell>
              <TableCell>Data Pagamento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <IconButton size="small" onClick={() => handleDelete(row.id)}>
                    <Icon className="material-symbols-outlined">delete</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => navigate(`/contas/detalhe/${row.id}`)}>
                    <Icon className="material-symbols-outlined">edit</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => handleUpdatePagamento(row.id)}>
                    <Icon className="material-symbols-outlined">check</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.cpf}</TableCell>
                <TableCell>{row.titulo}</TableCell>
                <TableCell>{row.valor}</TableCell>
                <TableCell>{row.valorAtualizadoComJuros}</TableCell>
                <TableCell>{row.vencimento}</TableCell>
                <TableCell>{row.contaAtrasada? 'SIM' : 'NÃO'}</TableCell>
                <TableCell>{row.taxaDeJurosPorDiasDeAtraso + '%'}</TableCell>
                <TableCell>{row.dataPagamento }</TableCell>
              </TableRow>
            ))}
          </TableBody>

          {totalCount === 0 && !isLoading && (
            <caption>{Environment.LISTAGEM_VAZIA}</caption>
          )}

          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            )}
            {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={pagina}
                    count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                    onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() }, { replace: true })}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};