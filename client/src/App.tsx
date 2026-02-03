import { Routes, Route } from 'react-router-dom';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';
import './styles/App.css';
import './styles/RecipeCard.css'
import './styles/RecipeList.css'
import ScrollToTop from './components/ScrollToTop';
import AddRecipe from './pages/AddRecipe';

function App() {
  return (
    <div className="app">
      <main>
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/add" element={<AddRecipe/>}/>
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/edit/:id" element={<EditRecipe />} />

        </Routes>
      </main>
      
      <ScrollToTop/>
    </div>
  );
}

export default App;