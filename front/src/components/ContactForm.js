import React, { useState } from 'react';
import './ContactForm.css';


function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:1234/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: 'Message from Contact Form',
        html: `Nom: ${formData.name}<br>Email: ${formData.email}<br>Message: ${formData.message}`,
      }),
    })
    .then(response => response.json())
    .then(data => alert('Message envoyé !'))
    .catch(error => console.error('Error:', error));
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nom</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label>Message</label>
        <textarea name="message" value={formData.message} onChange={handleChange} />
      </div>
      <button type="submit">Envoyer</button>
    </form>
  );
}

export default ContactForm;