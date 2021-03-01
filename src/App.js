import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer'

  const numRows = 100;
  const numCols = 100;

  const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
  ]

const  App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }

    return rows;
  });  
  const [running, setRunning] = useState(false);

  const runningRef = useRef();
  runningRef.current = running

  const runSimulation = useCallback(() => {
      if (!runningRef.current) {
        return;
      }

      setGrid(g => {
        return produce(g, gridCopy => {
          
          for (let i = 0; i < numRows; i++){
            for(let j = 0; j < numCols; j++){
              let neighbours = 0;
              operations.forEach(([x,y]) => {
                  const newI = i + x;
                  const newJ = i + y;
                  if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols){
                    neighbours += g[newI][newJ]
                  }
                }); 

                if (neighbours < 2 || neighbours > 3) {
                  gridCopy[i][j] = 0;
                } else if (g[i][j] === 0 && neighbours === 3) {
                  gridCopy[i][j] = 1;
                }
              }
            }
          });
      });
      
      
    setTimeout(runSimulation, 100);
    },[]);

  return (
    <>
    <button 
      onClick ={() => {
        setRunning(!running);
        if (!running){
        runningRef.current = true;
        runSimulation();
        }
      }
    
     }> {running ? 'stop' : 'start'}</button>
  <div
    style= {{
     display: 'grid',
     gridTemplateColumns: `repeat(${numCols}, 20px)`
   }}
  >
  {grid.map((rows, i) =>
   rows.map((col, j) => (
    
   <div
      key = {`${i}-${j}`}
      onClick={()=> {
        const newGrid = produce(grid, gridCopy => {
          gridCopy[i][j] = grid[i][j] ? 0 : 1;
        });
        setGrid(newGrid);
      }}
    style={{
     width: 20, 
      height: 20, 
      backgroundColor: grid[i][j] ? 'orange' : undefined,
      border: "solid 1px black"
   }}
   />
   ))
  )}

      </div>
    </>  
  );
};

export default App;
