import React, { useEffect, useState } from 'react';
import './index.css';
import apiRequest from './apiRequest';

const Jokes = () => {

    const API_URL = 'http://localhost:3500/items';
    const [items, setItems] = useState([]);
    const [newQuote, setNewQuote] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    
    useEffect(()=>{
      const fetchItems = async () => {
        const response = await fetch(API_URL);
        if(!response.ok) throw Error("Data not received")
        const listItems = await response.json();
        setItems(listItems);
      }
      (async () => await fetchItems())()
    },[])

    const changeItem = ()=> {
        setCurrentItemIndex((prevIndex)=>(prevIndex + 1) % items.length);
    };

    const deleteItem = async(id)=> {
      const listItems = items.filter((item)=> item.id !== id) 
      setItems(listItems);

      const deleteOptions = {method: 'DELETE'}
      const reqUrl = `${API_URL}/${id}`;
      await apiRequest(reqUrl, deleteOptions);
      
      const nextItemIndex = Math.min(currentItemIndex, listItems.length -1);
      setCurrentItemIndex(nextItemIndex);
    }

    const addItem = async(quote,author) => {
        const id = items.length ? items[items.length -1].id+1: 1;
        const addNewItem = {id,quotes: quote,author}
        const listItems = [...items,addNewItem];
        setItems(listItems);

        const postOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(addNewItem)
        }
        await apiRequest(API_URL, postOptions);
        changeItem();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newQuote || !newAuthor) return;
        addItem(newQuote, newAuthor);
        setNewQuote('');
        setNewAuthor('');
    }

  return (
    <div>
        <h1>Jokes Generator</h1> 
        <div className='jokes'>
          <div className="left-container">
            <form onSubmit={handleSubmit}>
              <textarea type="text" placeholder='Enter your own quotes...' value={newQuote} onChange={(e) => setNewQuote(e.target.value)} name='quote'/>
              <input type='text' placeholder='Enter Your Name...' value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} name='author' />
              <button type='submit'>Add Quote</button>
            </form>
            <div className="buttons">
              <button onClick={changeItem}>Change</button>
              <button onClick={()=>deleteItem(items[currentItemIndex].id)}>Delete</button>
            </div> 
          </div>
          <div className="changing">
              <span className='top'></span>  
              {items && items[currentItemIndex] && <p>{items[currentItemIndex].quotes}</p>}
              {items && items[currentItemIndex] && <b>{`Author - ${items[currentItemIndex].author}`}</b>}
          </div>   
        </div>
    </div>
  )
}

export default Jokes