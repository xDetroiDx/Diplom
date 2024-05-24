"use client"; // Указывает, что это Client Component

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function NewRecipe() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [steps, setSteps] = useState([{ description: '', file: null }]);
  const router = useRouter();

  const handleFileChange = (e, index) => {
    const newSteps = [...steps];
    newSteps[index].file = e.target.files[0];
    setSteps(newSteps);
  };

  const handleDescriptionChange = (e, index) => {
    const newSteps = [...steps];
    newSteps[index].description = e.target.value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, { description: '', file: null }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stepImages = await Promise.all(steps.map(async (step) => {
      const formData = new FormData();
      formData.append('file', step.file);

      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data.filePath;
    }));

    const res = await axios.post('/api/recipes', {
      title,
      body,
      steps: steps.map((step, index) => ({
        description: step.description,
        imageUrl: stepImages[index],
      })),
    });

    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Название рецепта:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Краткое описание:</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>
      <h3>Шаги приготовления:</h3>
      {steps.map((step, index) => (
        <div key={index}>
          <label>Описание шага {index + 1}:</label>
          <textarea
            value={step.description}
            onChange={(e) => handleDescriptionChange(e, index)}
            required
          />
          <label>Изображение для шага {index + 1}:</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, index)}
            required
          />
        </div>
      ))}
      <button type="button" onClick={addStep}>Добавить шаг</button>
      <button type="submit">Сохранить рецепт</button>
    </form>
  );
}
