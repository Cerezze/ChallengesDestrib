import './App.css';
import { users } from './DB/users.js';
import { challengeBucket } from './DB/challengeBucket';
import { useEffect, useState } from 'react';

function App() {
  const [challengeBuck, setchallengeBucket] = useState([]);
  const [usersChallengeTasks, setUsersChallengeTasks] = useState([]);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState();

  let cb;
  let uCT;
  let time;

  if(localStorage.getItem('challengeBucket') !== null && localStorage.getItem('users') !== null){
    cb = JSON.parse(localStorage.getItem('challengeBucket'));
    uCT = JSON.parse(localStorage.getItem('users')).challengeTasks.taskList;
    time = JSON.parse(localStorage.getItem('users')).challengeTasks.timeLeftForTaskList;
  }

  const getRandomTasks = (i, j, numberOfRandomTasks) => {
    let randomNumber;
    while(i < numberOfRandomTasks){
      randomNumber = Math.floor(Math.random() * j);
      uCT.push(cb[randomNumber]);
      const firstArr = cb.slice(0, cb.indexOf(cb[randomNumber]));
      const secondArr = cb.slice(cb.indexOf(cb[randomNumber]) + 1);
      cb = [...firstArr, ...secondArr];
      j--;
      i++;
    }
    
    setUsersChallengeTasks([...uCT]);
  }

  const finishTaskHandler = (i) =>{
    let user = JSON.parse(localStorage.getItem('users'));
    user.finishedTasks.push(i);
    localStorage.setItem('users', JSON.stringify(user));
  }

  const setMockStorage = () =>{
    localStorage.setItem('challengeBucket', JSON.stringify(challengeBucket));
    localStorage.setItem('users', JSON.stringify(users));
  }

  const deleteMockStorage = () =>{
    localStorage.removeItem('challengeBucket');
    localStorage.removeItem('users');
  }

  const refreshTasks = () => {
    setUsersChallengeTasks([]);
  }

  const setTimeHandler = () =>{
    let user = JSON.parse(localStorage.getItem('users'));
    user.challengeTasks.timeLeftForTaskList = +new Date + 30000;
    localStorage.setItem('users', JSON.stringify(user));
    setTimer(JSON.parse(localStorage.getItem('users')).challengeTasks.timeLeftForTaskList);
  }

  const clearTimeHandler = () =>{
    let user = JSON.parse(localStorage.getItem('users'));
    user.challengeTasks.timeLeftForTaskList = 0;
    localStorage.setItem('users', JSON.stringify(user));
    setTimer(0);
    setDays(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  }

  useEffect(() => {
    console.log(timer);
    if(timer !== 0){
      const interval = setInterval(() => {
        var now = new Date().getTime();
        var distance = time - now;
      
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if(distance < 0){
          setDays(0);
          setHours(0);
          setMinutes(0);
          setSeconds(0);
        }else{
          setDays(days);
          setHours(hours);
          setMinutes(minutes);
          setSeconds(seconds);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  console.log(timer);

  return (
    <div className="App">
      <button onClick={setMockStorage}>Set Storage</button>
      <button onClick={deleteMockStorage}>Delete Storage</button>
      <button onClick={()=>getRandomTasks(0, 7, 3)}>Get Tasks</button>
      {
        usersChallengeTasks.map((i, index) => {
          return (<p key={Math.random()}>{i.taskName}
          <button onClick={()=> finishTaskHandler(i.id)}>Done</button></p>)
        })
      }
      <button onClick={refreshTasks}>refreshTasks</button>
      <button onClick={setTimeHandler}>reset Time</button>
      <button onClick={clearTimeHandler}>clear time</button>
      <p>{days + ' ' + hours + ' ' + minutes + ' ' + seconds}</p>
    </div>
  );
}

export default App;
