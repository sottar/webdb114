import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from './App.module.css';

interface Chat {
  name: string;
  msg: string;
}

const App: React.FC = () => {
  const [displayLoginForm, setDisplayLoginForm] = useState(true);
  const [loginName, setLoginName] = useState('');
  const [messageList, setMessageList] = useState<Chat[]>([]);
  const [receivedMessage, setReceivedMessage] = useState<Chat>({ name: '', msg: '' });
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [inputtedValue, setInputtedValue] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:3001');
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('chat', (chat: Chat) => {
      setReceivedMessage(chat);
    });
    socket.on('joined', (name: string) => {
      setReceivedMessage({ name: name, msg: 'joined!' });
    });
    socket.on('left', (name: string) => {
      setReceivedMessage({ name: name, msg: 'left.' });
    });
  }, [socket]);

  useEffect(() => {
    if (messageList.length === 0 && receivedMessage.msg === '') {
      return;
    }
    setMessageList([...messageList, receivedMessage]);
  }, [receivedMessage]); // eslint-disable-line

  const onChangeHandler = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setInputtedValue(e.currentTarget.value);
  };

  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!socket) {
      return;
    }

    e.preventDefault();
    socket.emit('chat message', { name: loginName, msg: inputtedValue });
    setInputtedValue('');
  };

  const changeLoginNameHandler = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setLoginName(e.currentTarget.value);
  };

  const loginHandler = () => {
    if (!socket) {
      return;
    }

    socket.emit('join', loginName);
    setDisplayLoginForm(false);
  };

  if (displayLoginForm) {
    return (
      <div>
        login name: <input type="text" value={loginName} onChange={changeLoginNameHandler} />
        <button onClick={loginHandler}>login</button>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <ul className={styles.message}>
        {messageList.map((c, i) => (
          <li key={`${c.msg}${i}`}>
            <span className={styles.name}>{c.name}</span>
            <p className={styles.msg}>{c.msg}</p>
          </li>
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
