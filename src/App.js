import './styles/App.css';
import AppRouter from './AppRouter';
import { DataProvider } from './DataProvider';

//ce Fichier est la source de l'application. C'est lui qui ouvre la page d'accueil.

function App() {
  return (
    <DataProvider>
      <div className='App'>
        <AppRouter/>
      </div>
    </DataProvider>
  );
}

export default App;
