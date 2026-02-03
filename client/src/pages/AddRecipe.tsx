import React from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import '../styles/AddRecipe.css';

const AddRecipe: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="add-recipe-page">
        <header className="page-header-centered">
          <h1>Add New Recipe</h1>
          <p className="page-subtitle">Fill in the details below to expand your crate</p>
        </header>

        <main className="form-wrapper">
          <RecipeForm onSuccess={handleSuccess} />
        </main>
      </div>
    </div>
  );
};

export default AddRecipe;