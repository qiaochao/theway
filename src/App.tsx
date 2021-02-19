import React from 'react';
import './App.css';
import {StartPage,GamePage} from '@src/page/index'
import {useSelector} from 'react-redux' 
import { PageEnum, StateType } from './common/interface';

function App() {
  let page=useSelector<StateType>(state=>state.page)
  let curPage=<StartPage/>;
  switch(page){
    case PageEnum.start:
      curPage=<StartPage/>;
      break;
    case PageEnum.game:
      curPage=<GamePage/>
  }
  return (
    <div className="App">
      {curPage}
    </div>
  );
}

export default App;
