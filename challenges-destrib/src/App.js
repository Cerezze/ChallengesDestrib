import './App.css';
import { users } from './DB/users.js';
import { challengeBucket } from './DB/challengeBucket';
import { useEffect, useState } from 'react';

function App() {
  const [challengeBuck, setchallengeBucket] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [usersChallengeTasks, setUsersChallengeTasks] = useState([]);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState();

  useEffect(()=>{
    if(localStorage.getItem('challengeBucket') !== null){
      let cb1 = JSON.parse(localStorage.getItem('challengeBucket'));
      setchallengeBucket([...cb1]);
      console.log(cb1);
    }
  },[]);

  const getRandomTasks = (i, j, numberOfRandomTasks) => {
    let cb = challengeBuck;
    console.log(cb);
    let u = JSON.parse(localStorage.getItem('users'));
    if(usersChallengeTasks.length === 0){
      let randomNumber;
        while(i < numberOfRandomTasks){
          randomNumber = Math.floor(Math.random() * j);
          u.challengeTasks.taskList.push(cb[randomNumber]);
          const firstArr = cb.slice(0, cb.indexOf(cb[randomNumber]));
          const secondArr = cb.slice(cb.indexOf(cb[randomNumber]) + 1);
          cb = [...firstArr, ...secondArr];
          j--;
          i++;
        }
        localStorage.setItem('users', JSON.stringify(u));
        setUsersChallengeTasks([...u.challengeTasks.taskList]);
    }
  }

  const alterChallengeBucket = () => {
    if(finishedTasks.length > 0){
      let arr1 = challengeBuck;
      let arr2 = finishedTasks;

      let res = arr1.filter((i, index) =>{
        return !arr2.find(element => {
          return element.id === i.id;
        });
      });
      //console.log(res);
      setchallengeBucket([...res]);
    }
  }

  useEffect(() => {
    alterChallengeBucket();
  }, [finishedTasks.length]);

  const finishTaskHandler = (i) =>{
    let user = JSON.parse(localStorage.getItem('users'));
    let cb = JSON.parse(localStorage.getItem('challengeBucket'));
    let userObj = {
      userName: user.userName,
      timesCompleted: 0
    };
    cb[user.challengeTasks.taskList[i].id - 1].listOfUsersThatCompletedTask.push(userObj);
    user.finishedTasks.push(user.challengeTasks.taskList[i]);
    setFinishedTasks([...user.finishedTasks]);
    let uk 
    uk = user.challengeTasks.taskList.filter((x, index) =>{
      return index !== i;
    });

    localStorage.setItem('challengeBucket', JSON.stringify(cb));
    user.challengeTasks.taskList = uk;

    localStorage.setItem('users', JSON.stringify(user));
    setUsersChallengeTasks([...user.challengeTasks.taskList]);
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
    let user = JSON.parse(localStorage.getItem('users'));
    user.challengeTasks.taskList = [];
    localStorage.setItem('users', JSON.stringify(user));
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
        var distance = JSON.parse(localStorage.getItem('users')).challengeTasks.timeLeftForTaskList - now;
      
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

  return (
    <div className="App">
      <button onClick={setMockStorage}>Set Storage</button>
      <button onClick={deleteMockStorage}>Delete Storage</button>
      <button onClick={()=>getRandomTasks(0, challengeBuck.length, 3)}>Get Tasks</button>
      {
        usersChallengeTasks.map((i, index) => {
          return (<p key={Math.random()}>{i.taskName}
          <button onClick={()=> finishTaskHandler(index)}>Done</button></p>)
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
