import React, {useEffect, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TrashIcon } from '@heroicons/react/outline';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {tasks_all} from "./GoogleLogin";

function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [inputText, setInputText] = useState('');

    const handleChange = (e) => {
        setInputText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim() !== '') {
            setTodos([...todos, { id: uuidv4(), text: inputText, completed: false }]);
            setInputText('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (e, id) => {
        e.stopPropagation()
        setTodos(todos.filter((todo) => todo.id !== id));
    };


    const CLIENT_SECRET = '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';
    const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
    const SCOPES = ['https://www.googleapis.com/auth/tasks'];


    useEffect(() => {
        const intervalId = setInterval(() => {

            // This function will be called every second

            let updated_tasks = []
            for (var i =0;i<tasks_all.length;i++){
                 updated_tasks.push(tasks_all[i]['title'])
            }

            setTodos(prevTodos => {
                const newTodos = updated_tasks.map(task => ({
                    id: uuidv4(),
                    completed: false,
                    text: task
                }));

                // Filter out duplicates based on text
                const filteredNewTodos = newTodos.filter(newTodo => !prevTodos.some(todo => todo.text === newTodo.text));

                return [...prevTodos, ...filteredNewTodos];
            });


        }, 1000); // Interval set to 1000 milliseconds (1 second)

        // Cleanup function to clear the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []); // Empty dependency array ensures that the effect runs only once after the initial render



    return (
        <div className="max-w-md mx-auto mt-8">

            <h1 className="text-3xl font-bold mb-6">Todo App</h1>

            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    placeholder="Add Todo"
                    value={inputText}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md ml-2 mt-2"
                >
                    Add
                </button>


            </form>


            <ul>
                <TransitionGroup>
                {todos.map(
                    (todo) => (
                        <CSSTransition key={todo.id} timeout={300} classNames="item">

                        <li
                            key={todo.id}
                            className={`text-xl flex justify-between m-2
                             hover:cursor-pointer rounded-lg p-3 bg-blue-100 hover:bg-blue-300 transition duration-300
                          `}
                            onClick={() => toggleTodo(todo.id)}
                        >

                            <span className={`m-2
                                  ${
                                todo.completed ? 'line-through text-gray-500' : ''
                            } 
                            `}>{todo.text}</span>


                            <button
                                onClick={(e) => deleteTodo(e, todo.id)}
                                className="text-red-200 hover:text-red-600 m-2"
                            >
                                <TrashIcon className="w-6 h-6" />

                            </button>
                        </li>
                        </CSSTransition>
                    )
                )}
                </TransitionGroup>
            </ul>


        </div>
    );
}


export default TodoApp;
