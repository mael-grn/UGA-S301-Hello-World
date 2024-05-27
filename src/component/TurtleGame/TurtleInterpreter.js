// TurtleInterpreter.js
const interpretBlocks = (code) => {
  const lines = [];
  let currentPosition = { x: 400, y: 300 };
  let currentAngle = 0;
  let penDown = true;
  let penColor = "#29FCA6"; 
  let bgColor = "#FFFFFF"; 

/**
 * Interprète la commande spécifiée et met à jour l'état en conséquence.
 * @param {Object} command - La commande à interpréter.
 * @param {number} index - L'index de la commande dans la liste des commandes.
 */
  const interpretCommand = (command,index) => {
    console.log('Interpreting command:', command);

    switch (command.type) {
      case 'turtle.forward':
        const distanceForward = command.parameter || 0;
        const newXForward = currentPosition.x + distanceForward * Math.cos((currentAngle * Math.PI) / 180);
        const newYForward = currentPosition.y + distanceForward * Math.sin((currentAngle * Math.PI) / 180);

        if (penDown) {
          console.log('New Position Forward:', { x: newXForward, y: newYForward });
          lines.push({
            x1: currentPosition.x,
            y1: currentPosition.y,
            x2: newXForward,
            y2: newYForward,
            color: penColor,
            bgColor: bgColor
          });
        }

        currentPosition = { x: newXForward, y: newYForward };
        break;

      case 'turtle.backward':
        const distanceBackward = command.parameter || 0;
        const newXBackward = currentPosition.x - distanceBackward * Math.cos((currentAngle * Math.PI) / 180);
        const newYBackward = currentPosition.y - distanceBackward * Math.sin((currentAngle * Math.PI) / 180);

        if (penDown) {
          console.log('New Position Backward:', { x: newXBackward, y: newYBackward });
          lines.push({
            x1: currentPosition.x,
            y1: currentPosition.y,
            x2: newXBackward,
            y2: newYBackward,
            color: penColor,
            bgColor: bgColor
          });
        }

        currentPosition = { x: newXBackward, y: newYBackward };
        break;

      case 'turtle.right':
        currentAngle += parseFloat(command.parameter) || 0;
        break;

      case 'turtle.left':
        currentAngle -= parseFloat(command.parameter) || 0;
        break;

      case 'turtle.pendown':
        penDown = true;
        break;

      case 'turtle.penup':
        penDown = false;
        break;

      case 'turtle.circle':
        const radius = command.parameter || 0;
        const numSegments = 100; // Nombre de segments pour approximer le cercle
        const angleIncrement = (2 * Math.PI) / numSegments;

        for (let i = 0; i < numSegments; i++) {
          const startX = currentPosition.x + radius * Math.cos(i * angleIncrement);
          const startY = currentPosition.y + radius * Math.sin(i * angleIncrement);
          const endX = currentPosition.x + radius * Math.cos((i + 1) * angleIncrement);
          const endY = currentPosition.y + radius * Math.sin((i + 1) * angleIncrement);

          if (penDown) {
            lines.push({
              x1: startX,
              y1: startY,
              x2: endX,
              y2: endY,
              color: penColor,
              bgColor: bgColor
            });
          }
        }
        break;

      case 'turtle.color':
        penColor = command.parameter || "#29FCA6"; 

        case 'turtle.goto':
          console.log('commande :',command,' commande param : ',command.parameter)
         
            const params = command.parameter.split(',').map((param) => param.trim());
            console.log('params : ', params);
  
            if (params.length === 2) {
              const gotoX = parseFloat(params[0]) || 0;
              const gotoY = parseFloat(params[1]) || 0;
              console.log('test 1');
              if (!isNaN(gotoX) && !isNaN(gotoY)) {
                console.log('test 2 :', gotoX, gotoY);
                console.log('test 2 bis :', currentPosition.x, currentPosition.y);

                
  
                if (penDown) {
                  console.log('test 3 pendown:', penDown)
                  lines.push({
                    x1: currentPosition.x,
                    y1: currentPosition.y,
                    x2: gotoX,
                    y2: gotoY,
                    color: penColor,
                    bgColor: bgColor,
                  });
                }
                currentPosition = { x: gotoX, y: gotoY };

              
            }
          }
          break;

      case 'turtle.for i in range':
          const paramess = command.parameter.split(',').map((param) => param.trim());
          console.log('test');

          if (paramess.length === 1) {
            const loopCount = parseInt(paramess[0]) || 0;

            const loopBlocks = [];
            let isInsideForLoop = true;
            let loopDepth = 1;

            index++;

            while (index < commands.length && (isInsideForLoop || loopDepth > 0)) {
              const loopCommand = commands[index];
              if (loopCommand.includes('turtle.for i in range')) {
                loopDepth++;
              } else if (loopCommand.includes('end for')) {
                loopDepth--;
                if (loopDepth === 0) {
                  isInsideForLoop = false;
                }
              }
              loopBlocks.push(loopCommand);
              index++;
            }

            for (let i = 0; i < loopCount; i++) {
              loopBlocks.forEach((loopCommand) => {
                const [type, parameter] = loopCommand.split('(').map((part) => part.replace(/[()]/g, ''));
                interpretCommand({ type, parameter: parameter });
              });
            }
          }
          break;

          
  
        default:
          break;
      }
    };

  const commands = code.split('\n').filter((command) => command.trim() !== '');
  commands.forEach((command,index) => {
    const [type, parameter] = command.split('(').map((part) => part.replace(/[()]/g, ''));
    interpretCommand({ type, parameter: parameter },index);
  });

  return lines;
};

export default interpretBlocks;
