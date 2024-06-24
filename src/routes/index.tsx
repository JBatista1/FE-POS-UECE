import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import { useEffect } from 'react';
import { Dashboard, DetalheDeContas, ListagemDeContas } from '../pages';
import { ContasService } from '../shared/services/api/contas/contasServices';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        to: '/pagina-inicial',
        label: 'Página inicial',
      },
      {
        icon: 'star',
        to: '/contas',
        label: 'Contas',
      }
    ]);
  },[]);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard/>} />
      <Route path="/contas" element={<ListagemDeContas/>} />
      <Route path="/contas/detalhe/:id" element={<DetalheDeContas/>} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};