import './App.css';
import { users } from './DB/users.js';
import { challengeBucket } from './DB/challengeBucket';
import { useEffect, useState } from 'react';
//for testing we will just grab 3 tasks and wait 1 min for completion
//use state and functional style only

function App() {
  const [challengeBuck, setchallengeBucket] = useState(challengeBucket);
  const [usersChallengeTasks, setUsersChallengeTasks] = useState(users.challengeTasks);
  const [date, setDate] = useState();

  let cb = challengeBuck;
  let uCT = usersChallengeTasks;

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
    //console.log('uTC::', uCT);
    setUsersChallengeTasks([...uCT]);
    setTimeHandler();
  }

  const refreshTasks = () => {
    setUsersChallengeTasks([]);
  }

  const setTimeHandler = () =>{
    localStorage.endTime = +new Date + 604800000;
  }

  const clearTimeHandler = () =>{
    localStorage.removeItem('endTime');
  }

  useEffect(() => {
    if(localStorage.getItem('endTime')){
      const interval = setInterval(() => {
        var now = new Date().getTime();
        var distance = localStorage.endTime - now;
      
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setDate(days + ' ' + hours + ' ' + minutes + ' ' + seconds);
      }, 1000);
    
      return (distance) => {
        if(distance < 0){
          clearInterval(interval);
          console.log('Dunzo');
        }
      }
    }
  }, [localStorage.getItem('endTime')]);

  return (
    <div className="App">
      <button onClick={()=>getRandomTasks(0, 7, 3)}>Get Tasks</button>
      {
        usersChallengeTasks.map(i => {
          return <p key={Math.random()}>{i.taskName}</p>
        })
      }
      <button onClick={refreshTasks}>refreshTasks</button>
      <button onClick={setTimeHandler}>reset Time</button>
      <button onClick={clearTimeHandler}>clear time</button>
      <p>{date}</p>
    </div>
  );
}

export default App;
