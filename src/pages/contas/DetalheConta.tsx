import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { ContasService, IcreateConta } from '../../shared/services/api/contas/contasServices';
import { VTextField, VForm, useVForm, IVFormErrors } from '../../shared/forms';
//import { AutoCompleteCidade } from './components/AutoCompleteCidade';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';


interface IFormData {
    id: number;
    cpf: string;
    titulo: string;
    valor: number;
    //valorAtualizadoComJuros: number;
    vencimento: Date;
    //contaAtrasada: boolean;
    taxaDeJurosPorDiasDeAtraso: number;
    //dataPagamento: Date;
}
// const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
//   id: yup.number().required(),
//   cpf: yup.string().required(),
//   titulo: yup.string().required(),
//   valor: yup.number().required(),
//   //valorAtualizadoComJuros: yup.number().required(),
//   vencimento: yup.date().required(),
//   taxaDeJurosPorDiasDeAtraso: yup.number().required(),
// });

export const DetalheDeContas: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();


  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);

      ContasService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/contas');
          } else {
            setNome(result.titulo);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        cpf: '',
        titulo: '',
        valor: 0,
        valorAtualizadoComJuros: 0,
        vencimento: undefined,
        contaAtrasada: false,
        taxaDeJurosPorDiasDeAtraso: 0,
        dataPagamento: undefined,
      });
    }
  }, [id]);


  const handleSave = (dados: IFormData) => {

    console.log('handlesave');

    setIsLoading(true);
    console.log('handlesave');
    if (id === 'nova') {
      ContasService
        .create(dados)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            if (isSaveAndClose()) {
              navigate('/contas');
            } else {
              navigate(`/contas/detalhe/${result}`);
            }
          }
        });
    } else {
      ContasService
        .updateById(Number(id), {
          ...dados,
          id: 0
        })
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            if (isSaveAndClose()) {
              navigate('/Contas');
            }
          }
        });
    }

    // formValidationSchema.
    //   validate(dados, { abortEarly: false })
    //   .then((dadosValidados: Omit<IcreateConta, 'id'>) => {
        
    //   })
    //   .catch((errors: yup.ValidationError) => {
    //     const validationErrors: IVFormErrors = {};

    //     errors.inner.forEach(error => {
    //       if (!error.path) return;

    //       validationErrors[error.path] = error.message;
    //     });

    //     formRef.current?.setErrors(validationErrors);
    //   });
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      ContasService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/contas');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova conta' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate('/contas')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/contas/detalhe/nova')}
        />
      }
    >
      <VForm ref={formRef} onSubmit={handleSave} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">

          <Grid container direction="column" padding={2} spacing={2}>

            {isLoading && (
              <Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>
            )}

            <Grid item>
              <Typography variant='h6'>Geral</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='cpf'
                  disabled={isLoading}
                  label='Cpf'
                  //onChange={e => setNome(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='titulo'
                  label='Titulo'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='valor'
                  label='Valor'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            
                
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='vencimento'
                  label='Vencimento'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            {/* <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='contaAtrasada'
                  label='Conta atrasada'
                  disabled={isLoading}
                />
              </Grid>
            </Grid> */}

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='taxaDeJurosPorDiasDeAtraso'
                  label='Taxa de juros por dia de atraso'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
            
            {/* <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='dataPagamento'
                  label='Data de Pagamento'
                  disabled={isLoading}
                />
              </Grid>
            </Grid> */}
            

          </Grid>

        </Box>
      </VForm>
    </LayoutBaseDePagina>
  );
};