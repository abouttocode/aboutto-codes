import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer'

  const numRows = 30;
  const numCols = 50;
  const cellHeight = 20;
  const cellWidth = 20;

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

  const generateEmptyGrid = () => {
    const rows = [];
    for (let row = 0; row < numRows; row++) {
      rows.push(Array.from(Array(numCols), () => 0))
    }
    return rows;
  }

const  App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  });  
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running

  const runSimulation = useCallback(() => {
      if (!runningRef.current) {
        return;
      }

      setGrid(g => {
        return produce(g, gridCopy => {
          
          for (let row = 0; row < numRows; row++){
            for(let col = 0; col < numCols; col++){
              let neighbours = 0;
              operations.forEach(([x,y]) => {
                  const newRow = row + x;
                  const newCol = col + y;
                  if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols){
                    neighbours += g[newRow][newCol]
                  }
                }); 

                if (neighbours < 2 || neighbours > 3) {
                  gridCopy[row][col] = 0;
                } else if (g[row][col] === 0 && neighbours === 3) {
                  gridCopy[row][col] = 1;
                }
              }
            }
          });
      });
      
      
    setTimeout(runSimulation, 16.6667);
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

     <button onClick={() => {
       
       setGrid(generateEmptyGrid())
     }} 
     >clear </button>
    <button onClick= {() => {
      const rows = [];
    for (let row = 0; row < numRows; row++) {
      rows.push(Array.from(Array(numCols), () => Math.random() > .6 ? 1 : 0))
    }
      setGrid(rows);
    }}
     >random
     </button>


  <div
    style= {{
     display: 'grid',
     gridTemplateColumns: `repeat(${numCols}, 20px)`
   }}
  >
  {grid.map((rows, row) =>
   rows.map((cols, col) => (
    

  
   <div
      key = {`${row}-${col}`}
      onClick={()=> {
        const newGrid = produce(grid, gridCopy => {
          gridCopy[row][col] = grid[row][col] ? 0 : 1;
        });
        setGrid(newGrid);
      }}
    style={{
     width: cellHeight, 
      height: cellWidth, 
      backgroundColor: grid[row][col] ? 'red' : undefined,
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
