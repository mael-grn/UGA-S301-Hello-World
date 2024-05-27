function compareBlockTypes(expectedBlocks, droppedBlocks) {
    if (expectedBlocks.length !== droppedBlocks.length) {
      if(expectedBlocks.length<droppedBlocks.length){
        return 'Erreur : nombre de blocs fournis supérieur au nombre de blocs attendus.';
      }
      else{
        return 'Erreur : nombre de blocs fournis inférieur au nombre de blocs attendus.';
      }
    }
  
    for (let i = 0; i < expectedBlocks.length; i++) {
      if (expectedBlocks[i].type !== droppedBlocks[i].type) {
        const message = `Erreur : le type "${droppedBlocks[i].type}" de "${droppedBlocks[i].nom}" à la position ${i} est différent du type attendu.`;
        if(i==0){
            return message + ' Une requête commence soit par SELECT, UPDATE ou INSERT.'
        }
        else if(expectedBlocks[i].type=='ingredient'){
            return message + ' Un ingrédient est attendu ici...'
        }
        else if(expectedBlocks[i].type=='syntaxe'){
            return message + ' Un élément de syntaxe est attendu ici...'
        }
        else if(expectedBlocks[i].type=='rangement'){
            return message + ' Un rangement est attendu ici...'
        }
        return message + '\n';
      }
      else if(expectedBlocks[i].nom !== droppedBlocks[i].nom){
        return `Erreur :  "${droppedBlocks[i].nom}" à la position ${i} est bien du type attendu mais n'est pas le bon bloc`;
      }
    }
  
    return 'aucune différence de types détectée entre les blocs.';
  }

  function correctsBlocksFun(expectedBlocks, droppedBlocks) {
    console.log(expectedBlocks,droppedBlocks);
    const elem = [];
    let correct = ''; // Variable pour compter les éléments corrects
    for (let i = 0; i < droppedBlocks.length; i++) {
        if(i>=expectedBlocks.length){
           elem.push('incorrect');
        }
      else if (expectedBlocks[i].type === droppedBlocks[i].type && expectedBlocks[i].nom === droppedBlocks[i].nom) {
       // correct += expectedBlocks[i].nom + ' '; // Ajouter l'élément correct à la variable
       elem.push('correct');
    }
      else{
        elem.push('incorrect');
    }
    }
    console.log(droppedBlocks);
    return elem; // Retourner la variable correct après avoir supprimé les espaces superflus
  }
  
  const LogError = [];
  
  export { compareBlockTypes,correctsBlocksFun, LogError };