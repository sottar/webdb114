import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { call } from './api';
import styles from './App.module.css';

const App: React.FC = () => {
  const [messageList, setMessageList] = useState<string[]>([]);
  const [receivedMessage, setReceivedMessage] = useState('');
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [inputtedValue, setInputtedValue] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:3001');
    setSocket(socket);
  }, []);

  useEffect(() => {
    socket &&
      socket.on('chat message', (msg: string) => {
        setReceivedMessage(msg);
        console.log(`receive message: ${msg}`);
      });
  }, [socket]);

  useEffect(() => {
    if (messageList.length === 0 && receivedMessage === '') {
      return;
    }
    setMessageList([...messageList, receivedMessage]);
  }, [receivedMessage]);

  const onChangeHandler = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setInputtedValue(e.currentTarget.value);
  };

  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!socket) {
      return;
    }

    e.preventDefault();
    socket.emit('chat message', inputtedValue);
    setInputtedValue('');
  };

  console.log(messageList);

  return (
    <div className={styles.app}>
      <ul className={styles.message}>
        {messageList.map((m, i) => (
          <li key={`${m}${i}`}>{m}</li>
        ))}
      </ul>
      <div className={styles.inputWrapper}>
        <input className={styles.input} type="text" id="m" value={inputtedValue} onChange={onChangeHandler} />
        <button className={styles.submitButton} onClick={onClickHandler}>
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
