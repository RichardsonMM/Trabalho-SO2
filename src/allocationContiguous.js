// allocationContiguous.js

export const generateRandomColor = () => {
    const randomColor =
      "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    return randomColor;
  };
  
  export const addFileContiguous = (
    nodes,
    fileName,
    fileSize,
    setNodes,
    fileColors,
    setFileColors,
    setAllocatedFiles,
    allocatedFiles
  ) => {
    if (!fileName || fileSize <= 0) {
      return { success: false, message: "Preencha o nome e o tamanho do arquivo corretamente." };
    }
  
    let freeStartIndex = -1;
    let freeCount = 0;
  
    nodes.forEach((node, index) => {
      if (node.data.label === "Livre") {
        freeCount++;
        if (freeStartIndex === -1) freeStartIndex = index;
        if (freeCount === fileSize) return;
      } else {
        freeStartIndex = -1;
        freeCount = 0;
      }
    });
  
    if (freeCount < fileSize) {
      return { success: false, message: "Não há espaço contíguo suficiente para alocar o arquivo!" };
    }
  
    const fileColor = fileColors[fileName] || generateRandomColor();
    setFileColors({ ...fileColors, [fileName]: fileColor });
  
    const updatedNodes = [...nodes];
    for (let i = freeStartIndex; i < freeStartIndex + fileSize; i++) {
      updatedNodes[i] = {
        ...updatedNodes[i],
        data: { label: `${fileName} (Bloco ${i + 1})` },
        style: { backgroundColor: fileColor, border: "1px solid #000" },
      };
    }
  
    setNodes(updatedNodes);
  
    setAllocatedFiles([...allocatedFiles, { name: fileName, startBlock: freeStartIndex + 1, length: fileSize }]);
  
    return { success: true, message: `Arquivo '${fileName}' alocado contiguamente nos blocos ${freeStartIndex + 1} a ${freeStartIndex + fileSize}.` };
  };
  
  export const deleteFileContiguous = (
    nodes,
    fileName,
    startBlock,
    fileSize,
    setNodes,
    allocatedFiles,
    setAllocatedFiles
  ) => {
    const updatedFiles = allocatedFiles.filter((file) => file.name !== fileName);
  
    const updatedNodes = [...nodes];
    for (let i = startBlock - 1; i < startBlock - 1 + fileSize; i++) {
      updatedNodes[i] = {
        ...updatedNodes[i],
        data: { label: "Livre" },
        style: { backgroundColor: "#f0f0f0", border: "1px solid #007bff" },
      };
    }
  
    setNodes(updatedNodes);
    setAllocatedFiles(updatedFiles);
  
    return `Arquivo '${fileName}' deletado com sucesso!`;
  };
  