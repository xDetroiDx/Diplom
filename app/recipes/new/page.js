"use client"; // Директива для использования хуков

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Form() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [steps, setSteps] = useState([{ description: '', file: null }]);
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [recipeImage, setRecipeImage] = useState(null);
  const [recipeImagePreview, setRecipeImagePreview] = useState(null);
  const [stepImages, setStepImages] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      setIsAuthenticated(true);
      setShowLoginPopup(false);
    }
  }, []);

  const handleLogin = () => {
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      setShowLoginPopup(false);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      alert('Неверный логин или пароль');
    }
  };

  const handleStepChange = (index, event) => {
    const newSteps = [...steps];
    newSteps[index][event.target.name] = event.target.value;
    setSteps(newSteps);
  };

  const handleStepFileChange = (index, event) => {
    const newSteps = [...steps];
    newSteps[index].file = event.target.files[0];
    setSteps(newSteps);

    const newStepImages = [...stepImages];
    newStepImages[index] = URL.createObjectURL(event.target.files[0]);
    setStepImages(newStepImages);
  };

  const handleIngredientChange = (index, event) => {
    const newIngredients = [...ingredients];
    newIngredients[index][event.target.name] = event.target.value;
    setIngredients(newIngredients);
  };

  const handleRecipeImageChange = (event) => {
    setRecipeImage(event.target.files[0]);

    if (event.target.files[0]) {
      setRecipeImagePreview(URL.createObjectURL(event.target.files[0]));
    } else {
      setRecipeImagePreview(null);
    }
  };

  const addStep = () => {
    setSteps([...steps, { description: '', file: null }]);
    setStepImages([...stepImages, null]);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);

    if (recipeImage) {
      formData.append('image', recipeImage);
    }

    steps.forEach((step, index) => {
      formData.append(`steps[${index}][description]`, step.description);
      if (step.file) {
        formData.append(`steps[${index}][file]`, step.file);
      }
    });

    ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}][name]`, ingredient.name);
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
    });

    try {
      const res = await axios.post('/api/recipes/createRecipe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTitle('');
      setBody('');
      setSteps([{ description: '', file: null }]);
      setIngredients([{ name: '', quantity: '' }]);
      setRecipeImage(null);
      setRecipeImagePreview(null);
      setStepImages([]);
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-2xl mb-4 text-black">Login</h2>
          <div className="mb-4">
            <label className="block mb-2 text-black">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 w-full text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-black">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full text-black"
            />
          </div>
          <button onClick={handleLogin} className="bg-blue-500 text-white py-2 px-4 rounded">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Часть 1: Поля для заполнения рецепта */}
      <div className="w-1/3 p-5">
        <div className='flex flex-col items-center text-[32px]'><h2 className=' border-b-2 border-inherit'>Рецепт:</h2></div>
        <br/>
        <label>Название блюда (Title):</label><br/>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '350px', color: 'black' }}
        /><br/><br/>
        <label>Краткое описание блюда (Body):</label><br/>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          style={{ width: '350px', height: '100px', color: 'black' }}
        ></textarea><br/><br/>
        <label>Основное изображение блюда (Recipe Image):</label><br/>
        <input
          type="file"
          name="recipeImage"
          onChange={handleRecipeImageChange}
        />
        {recipeImagePreview && (
          <img src={recipeImagePreview} alt="Recipe" style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }} />
        )}
      </div>

      {/* Часть 2: Поля для ввода этапов готовки */}
      <div className="flex flex-col items-center w-1/3 p-5">
        <div className=' text-[32px] border-b-2 border-inherit'>Этапы готовки:</div>
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col p-5">
            <label>Название этапа (Step Description):</label><br/>
            <textarea
              type="text"
              name="description"
              value={step.description}
              onChange={(e) => handleStepChange(index, e)}
              required
              style={{ width: '350px', height: '100px', color: 'black' }}
            /><br/><br/>
            <label>Изображение этапа (Step Image):</label><br/>
            <input
              type="file"
              name="file"
              onChange={(e) => handleStepFileChange(index, e)}
            />
            {stepImages[index] && (
              <img src={stepImages[index]} alt={`Step ${index + 1}`} style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }} />
            )}
          </div>
        ))}
        <div className='flex flex-col justify-center border-2 border-inherit w-[250px]'><button type="button" onClick={addStep}>Добавить этап<br/>(Add Step)</button></div>
      </div>

      {/* Часть 3: Поля для ввода ингредиентов */}
      <div className="flex flex-col items-center w-1/3 p-5">
        <div className=' text-[32px] border-b-2 border-inherit'>Ингредиенты:</div>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex flex-col p-5">
            <label>Название ингредиента (Ingredient Name):</label><br/>
            <input
              type="text"
              name="name"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, e)}
              required
              style={{ width: '350px', color: 'black' }}
            /><br/><br/>
            <label>Количество ингредиента (Ingredient Quantity):</label><br/>
            <input
              type="text"
              name="quantity"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, e)}
              required
              style={{ width: '350px', color: 'black' }}
            />
          </div>
        ))}
        <div className='flex flex-col justify-center items-center border-2 border-inherit w-[250px]'><button type="button" onClick={addIngredient}>Добавить ингредиент<br/>(Add Ingredient)</button></div>
      </div>

      {/* Кнопка отправки формы */}
      <div className="w-full flex justify-center mt-8">
        <div className='flex justify-center h-[50px]'><button type="submit" onClick={handleSubmit} className=' w-[200px] border-2 border-inherit'>Добавить рецепт<br/>(Submit Recipe)</button></div>
      </div>
    </div>
  );
}
