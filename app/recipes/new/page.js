"use client"; // Директива для использования хуков

import { useState } from 'react';
import axios from 'axios';

export default function Form() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [steps, setSteps] = useState([{ description: '', file: null }]);
  const [image, setImage] = useState(null); // Новое состояние для загрузки изображения рецепта

  const handleStepChange = (index, event) => {
    const newSteps = [...steps];
    newSteps[index][event.target.name] = event.target.value;
    setSteps(newSteps);
  };

  const handleFileChange = (index, event) => {
    const newSteps = [...steps];
    newSteps[index].file = event.target.files[0];
    setSteps(newSteps);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const addStep = () => {
    setSteps([...steps, { description: '', file: null }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);

    if (image) {
      formData.append('image', image);
    }

    steps.forEach((step, index) => {
      formData.append(`steps[${index}][description]`, step.description);
      if (step.file) {
        formData.append(`steps[${index}][file]`, step.file);
      }
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
      setImage(null);
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
  };

  return (
    <div className='flex '>
    <form>
      <div className='felx p-5'>
        <label>Название блюда (Title):</label><br/>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '350px', color: 'black' }}
        />
      </div>
      <div className='felx p-5'>
        <label>Краткое описание блюда (Body):</label><br/>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          style={{ width: '350px', height: '100px', color: 'black' }}
        ></textarea>
      </div>
      <div className='felx p-5'>
        <label>Основное изображение блюда (Recipe Image):</label><br/>
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
        />
      </div>
      {steps.map((step, index) => (
        <div key={index} className='felx p-5'>
          <label>Описание этапа (Step Description):</label><br/>
          <input
            type="text"
            name="description"
            value={step.description}
            onChange={(e) => handleStepChange(index, e)}
            required
          /><br/><br/>
          <label>Изображение этапа (Step Image):</label><br/>
          <input
            type="file"
            name="file"
            onChange={(e) => handleFileChange(index, e)}
          />
        </div>
      ))}
      <div className='flex flex-row p-5'>
      <div className='flex mr-5 border-2 border-inherit w-[150px] justify-center'><button type="button" onClick={addStep}>Добавить этап <br/>(Add Step)</button></div>
      <div className='flex border-2 border-inherit w-[150px] justify-center'><button type="submit" onClick={handleSubmit}>Добавить <br/>(Submit)</button></div>
      </div>
    </form>
    </div>
  );
}
