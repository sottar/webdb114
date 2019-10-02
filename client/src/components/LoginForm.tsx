import React from 'react';

interface Props {
  inputtedValue: string;
  changeHandler: (e: React.SyntheticEvent<HTMLInputElement>) => void;
  loginHandler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const LoginForm = ({ inputtedValue, changeHandler, loginHandler }: Props) => {
  return (
    <div>
      login name: <input type="text" value={inputtedValue} onChange={changeHandler} />
      <button onClick={loginHandler}>login</button>
    </div>
  );
};
